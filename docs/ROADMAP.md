# Enact Protocol Roadmap

This document outlines planned features and improvements for the Enact Protocol and CLI, focusing on enhanced security, developer experience, and integration capabilities.

## 1. Enhanced Container Orchestration

### Services Support
**Goal:** Allow tools to define sidecar containers for integration testing or full-stack environments.

**Proposed Specification:**
Add a `services` field to the `enact.md` YAML frontmatter.

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
Add a `network` field to the `enact.md` YAML frontmatter.

```yaml
# Default: true (or based on policy)
network: false
```

**Behavior:** When set to `false`, Enact instructs the runtime (Dagger) to disable the network interface for the container.

## 2. Security Improvements

### Explicit Secrets Management
**Goal:** Distinguish between public environment variables and sensitive secrets to prevent accidental exposure in logs or caches.

**Proposed Specification:**
Split the current `env` field into `env` (public) and `secrets` (sensitive).

```yaml
env:
  LOG_LEVEL: "debug"

secrets:
  OPENAI_API_KEY:
    description: "Required for LLM inference"
```

**Behavior:** Secrets are injected securely into the container memory only for the duration of execution and are scrubbed from all logs and cache keys.

## 3. Developer Experience

### Interactive Debugging (`enact debug`)
**Goal:** Improve the troubleshooting experience for failing tools.

**Proposed Command:**
`enact debug <tool>`

**Behavior:**
1. Builds the container environment as defined in `enact.md`.
2. Mounts all inputs and sources.
3. Drops the user into an interactive shell *inside* the container before the main command runs.

### Multi-Architecture Support
**Goal:** Ensure tools run seamlessly across different hardware platforms (e.g., Apple Silicon vs. x86 Linux).

**Implementation:**
Leverage Dagger's cross-platform build capabilities during `enact publish` to verify or build tool bundles for multiple architectures (`linux/amd64`, `linux/arm64`).

## 4. Testing & Quality Assurance

### Automated Tool Testing (`enact test`)
**Goal:** Turn documentation examples into regression tests.

**Proposed Command:**
`enact test <tool>`

**Behavior:**
Automatically executes the scenarios defined in the `examples` field of `enact.md` and asserts that the output matches the expected result.
