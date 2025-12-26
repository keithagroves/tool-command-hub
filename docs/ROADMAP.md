# Enact Protocol Roadmap

This document outlines planned features and improvements for the Enact Protocol and CLI, focusing on enhanced security, developer experience, and integration capabilities.

## 1. Enhanced Container Orchestration

### Services Support
**Goal:** Allow tools to define sidecar containers for integration testing or full-stack environments.

**Proposed Specification:**
Add a `services` field to the `SKILL.md` YAML frontmatter.

```yaml
services:
  db:
    image: "postgres:15"
    env:
      POSTGRES_PASSWORD: "test"
  redis:
    image: "redis:alpine"
```

**Use Case:** A tool that runs database migration scripts or requires a temporary cache during execution.

### Network Isolation Control
**Goal:** Provide cryptographic guarantees against data exfiltration for sensitive tools.

**Proposed Specification:**
Add a `network` field to the `SKILL.md` YAML frontmatter.

```yaml
# Default: true (or based on policy)
network: false
```

**Behavior:** When set to `false`, Enact instructs the runtime (Dagger) to disable the network interface for the container.

## 2. Developer Experience

### Improved Input Handling for `enact run`
**Goal:** Make it easier to pass complex inputs to tools.

**Current State:**
- `--args '{"key": "value"}'` - Full JSON object
- `--input key=value` - Individual key-value pairs (repeatable)

**Proposed Enhancements:**
1. **Stdin support:** `--stdin` to read inputs as JSON from stdin
   ```bash
   echo '{"code": "function test() {...}"}' | enact run code-reviewer --stdin
   cat inputs.json | enact run my-tool --stdin
   ```
2. **Positional inputs:** `enact run tool key=value key2=value2` directly without `--input`
3. **File input:** `-f, --file <path>` to read inputs from a JSON/YAML file
4. **Interactive prompt:** Prompt for missing required inputs when in TTY mode

**Use Case:** Makes it easier to pass multi-line code, complex objects, or pipe data between tools.

### Interactive Debugging (`enact debug`)
**Goal:** Improve the troubleshooting experience for failing tools.

**Proposed Command:**
`enact debug <tool>`

**Behavior:**
1. Builds the container environment as defined in `SKILL.md`.
2. Mounts all inputs and sources.
3. Drops the user into an interactive shell *inside* the container before the main command runs.

### Multi-Architecture Support
**Goal:** Ensure tools run seamlessly across different hardware platforms (e.g., Apple Silicon vs. x86 Linux).

**Implementation:**
Leverage Dagger's cross-platform build capabilities during `enact publish` to verify or build tool bundles for multiple architectures (`linux/amd64`, `linux/arm64`).

## 3. Testing & Quality Assurance

### Automated Tool Testing (`enact test`)
**Goal:** Turn documentation examples into regression tests.

**Proposed Command:**
`enact test <tool>`

**Behavior:**
Automatically executes the scenarios defined in the `examples` field of `SKILL.md` and asserts that the output matches the expected result.

## 4. Cryptographic Publisher Signatures (Future)

**Goal:** Add Sigstore-based cryptographic signatures for publishers in addition to auditor attestations.

**Current State:** Publisher identity is enforced by enact.tools (username/namespace mapping), but not cryptographically signed.

**Proposed Enhancement:**
- Publishers sign their tools with Sigstore when publishing
- Provides cryptographic proof of publisher identity (not just registry enforcement)
- Enables offline verification of publisher identity
- Complements auditor attestations with publisher signatures

**Use Case:** Users can cryptographically verify that a tool was actually published by the claimed publisher, independent of trusting the enact.tools registry.

## 5. Registry-Side Builds with SLSA Provenance (Future)

**Goal:** Move the build process to enact.tools registry, providing trusted builds with cryptographic provenance signed by the registry itself.

**How It Would Work:**

1. User publishes source → `enact publish .`
2. enact.tools receives source and builds it in a controlled environment
3. enact.tools generates SLSA provenance with itself as the builder
4. enact.tools signs the provenance with its own identity

**Example Provenance:**
```json
{
  "builder": { "id": "https://enact.tools/builder@v1" },
  "buildType": "https://enact.tools/build/containerized@v1",
  "invocation": {
    "configSource": {
      "uri": "git+https://github.com/alice/my-tool@refs/tags/v1.0",
      "digest": { "sha1": "abc123..." }
    }
  },
  "metadata": {
    "buildInvocationId": "enact-build-456",
    "buildStartedOn": "2025-01-15T10:30:00Z",
    "buildFinishedOn": "2025-01-15T10:35:00Z"
  },
  "materials": [
    { "uri": "pkg:docker/node@18-alpine", "digest": { "sha256": "..." } }
  ]
}
```

**Benefits:**
- **Trusted builder:** enact.tools provides reproducible builds in controlled environment
- **Source-to-artifact tracking:** Cryptographic proof linking source code to published tool
- **Eliminates local build tampering:** Build happens server-side, not on publisher's machine
- **Easier for publishers:** No need to manage local build environments
- **SLSA Level 3+:** Achieves higher SLSA levels with isolated, auditable builds

**Publisher Workflow:**
```bash
# Publish source (not pre-built artifacts)
enact publish .
# → enact.tools builds and generates provenance
# ✓ Published alice/my-tool@v1.0 with SLSA provenance
#   Builder: enact.tools/builder@v1
#   Source: git+https://github.com/alice/my-tool@v1.0
```

**User Verification:**
When installing, users can verify:
- Who published the source (publisher identity)
- Who audited it (auditor attestations)
- That it was built by enact.tools (provenance signature)
- The exact source code used (git commit hash in provenance)

**Use Case:** Organizations can trust tools knowing they were built in a controlled environment by the registry, not on potentially compromised developer machines. Complete supply chain transparency from source to execution.

## 6. Tool Ratings and Feedback (Future)

**Goal:** Enable community feedback and ratings for tools in the registry to help users discover quality tools.

**API Endpoints:**

Submit feedback:
```bash
POST /tools/alice/utils/greeter/feedback
{
  "rating": 5,
  "comment": "Worked great for my use case..."
}
```

Retrieve feedback:
```bash
GET /tools/alice/utils/greeter/feedback
{
  "rating": 4.2,
  "review_count": 47,
  "downloads": 1203
}
```

**CLI Integration:**
```bash
# View ratings and feedback
enact info alice/utils/greeter

# Leave feedback after using a tool
enact feedback alice/utils/greeter --rating 5 --comment "Excellent tool"

# Search tools by rating
enact search --min-rating 4.0
```

**Features:**
- Star ratings (1-5)
- Written reviews/comments
- Download counts
- Aggregate ratings visible in tool metadata
- Optional: verified reviews (only from users who installed the tool)
- Optional: filter by auditor attestations + high ratings

**Benefits:**
- **Discovery:** Help users find high-quality, popular tools
- **Feedback loop:** Publishers get insights to improve their tools
- **Complement to attestations:** Ratings show practical usage, attestations show security review
- **Community building:** Foster engagement and tool ecosystem growth

**Use Case:** A user searching for a tool can see both security attestations (cryptographic trust) and community ratings (practical trust) to make informed decisions.

## 7. Simplify Tool Storage Architecture (Future)

**Goal:** Eliminate duplication between `~/.enact/tools/` and `~/.enact/cache/` by using a JSON manifest for installed tools.

**Current State:**
- `~/.enact/cache/{tool}/{version}/` - Downloaded, versioned bundles
- `~/.enact/tools/{tool}/` - Copied "installed" version (duplicates cache)
- `enact list` walks all directories recursively to find tools

**Proposed Change:**
```
~/.enact/
├── cache/{tool}/{version}/    # All tools live here (versioned)
├── installed.json             # List of "installed" tools with pinned versions
└── config.yaml
```

**`installed.json` format:**
```json
{
  "tools": {
    "alice/greeter": "1.0.0",
    "bob/formatter": "2.1.0"
  }
}
```

**Benefits:**
- **No file duplication** - Tools exist in one place (cache)
- **Faster `enact list`** - Read JSON instead of walking directories
- **Simpler disk usage** - No copying files during install
- **Version clarity** - JSON explicitly shows installed versions
- **Faster installs** - Just update JSON, no file copying

**Migration:** Existing `~/.enact/tools/` would be migrated to cache + JSON on first run.

---

## 8. Enact as OIDC Provider (Future)

**Goal:** Enable Enact to function as an OpenID Connect (OIDC) provider, allowing users to run their own Sigstore infrastructure with Enact-based authentication.

**Vision:**
- Run your own Sigstore + OIDC
- User signs in with Enact → `enact:alice`

**Use Case:** Organizations can maintain complete control over their signing infrastructure while leveraging Enact's identity system for code signing and artifact verification.
