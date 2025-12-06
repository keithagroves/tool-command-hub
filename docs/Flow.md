# Enact: Complete Flow Documentation

This document describes the end-to-end flows for discovering, installing, and running tools in the Enact ecosystem.

**Last Updated:** 2025-01-10

---

## Table of Contents

1. [Overview](#overview)
2. [Search Flow](#1-search-flow)
3. [Get Details Flow](#2-get-details-flow)
4. [Install Flow](#3-install-flow)
5. [Run Flow](#4-run-flow)
6. [Attestation Verification](#attestation-verification)
7. [Database Schema Summary](#database-schema-summary)
8. [Local Development](#local-development)

---

## Overview

Enact is a verified, portable system for AI-executable tools. The core flows are:

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Search  │ ──▶ │   Get    │ ──▶ │ Install  │ ──▶ │   Run    │
│          │     │ Details  │     │          │     │          │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
     │                │                │                │
     ▼                ▼                ▼                ▼
  Registry        Registry         Registry          Local
  (text           (metadata +      (bundle +        (Dagger
   search)         manifest)      attestations)    container)
```

**Key components:**

| Component | Purpose |
|-----------|---------|
| **Registry API** | Tool discovery, metadata, bundles, attestations (Supabase Edge Functions) |
| **Object Storage** | Bundle files (MinIO locally, S3/GCS/R2 in production) |
| **CLI** | User interface, verification, Dagger orchestration |
| **Dagger** | Container execution, sandboxing, caching |
| **Sigstore** | Cryptographic attestations (Fulcio CA + Rekor log) |

---

## 1. Search Flow

**Command:** `enact search "pdf extraction"`

### Sequence

```
┌──────┐          ┌──────────┐          ┌────────────┐
│ User │          │   CLI    │          │  Registry  │
└──┬───┘          └────┬─────┘          └─────┬──────┘
   │                   │                      │
   │ enact search      │                      │
   │ "pdf extraction"  │                      │
   │──────────────────▶│                      │
   │                   │                      │
   │                   │ GET /tools/search    │
   │                   │ ?q=pdf+extraction    │
   │                   │─────────────────────▶│
   │                   │                      │
   │                   │                      │ Hybrid search:
   │                   │                      │ 70% semantic (embeddings)
   │                   │                      │ 30% text matching
   │                   │                      │
   │                   │                      │ Order by combined score
   │                   │                      │
   │                   │    Search results    │
   │                   │◀─────────────────────│
   │                   │                      │
   │  Formatted list   │                      │
   │◀──────────────────│                      │
   │                   │                      │
```

### API Request

```
GET /tools/search?q=pdf%20extraction&limit=20&offset=0
```

### Database Query

```sql
-- Generate embedding for search query via OpenAI
-- Then call hybrid search function:
SELECT * FROM search_tools_hybrid(
    'pdf extraction',           -- text query
    query_embedding,            -- vector from OpenAI
    0.3,                        -- text weight (30%)
    0.7,                        -- semantic weight (70%)
    20                          -- limit
);

-- Fallback to text search if embeddings unavailable:
SELECT t.* FROM tools t
WHERE t.name ILIKE '%pdf extraction%'
   OR t.description ILIKE '%pdf extraction%'
ORDER BY t.total_downloads DESC;
```

### CLI Output

```
$ enact search "pdf extraction"

Found 2 tools:

  alice/pdf-extract (v2.1.0)          ↓ 12,503
  Extract text and tables from PDF files
  
  acme-corp/pdf-parser (v1.0.3)       ↓ 2,341
  Parse PDF documents into structured JSON

Use 'enact get <tool>' for details.
```

---

## 2. Get Details Flow

**Command:** `enact get alice/pdf-extract`

### Sequence

```
┌──────┐          ┌──────────┐          ┌────────────┐          ┌─────────┐
│ User │          │   CLI    │          │  Registry  │          │ Storage │
└──┬───┘          └────┬─────┘          └─────┬──────┘          └────┬────┘
   │                   │                      │                      │
   │ enact get         │                      │                      │
   │ alice/pdf-extract │                      │                      │
   │──────────────────▶│                      │                      │
   │                   │                      │                      │
   │                   │ GET /tools/          │                      │
   │                   │ alice/pdf-extract    │                      │
   │                   │─────────────────────▶│                      │
   │                   │                      │                      │
   │                   │   Tool metadata +    │                      │
   │                   │   versions           │                      │
   │                   │◀─────────────────────│                      │
   │                   │                      │                      │
   │                   │ GET /tools/.../      │                      │
   │                   │ versions/2.1.0/      │                      │
   │                   │ attestations         │                      │
   │                   │─────────────────────▶│                      │
   │                   │                      │                      │
   │                   │  Attestation list    │                      │
   │                   │◀─────────────────────│                      │
   │                   │                      │                      │
   │ Formatted details │                      │                      │
   │◀──────────────────│                      │                      │
```

### API Requests

```
GET /tools/alice/pdf-extract
GET /tools/alice/pdf-extract/versions/2.1.0/attestations
```

### Database Queries

Tool metadata with versions:
```sql
SELECT t.*, tv.*
FROM tools t
JOIN tool_versions tv ON tv.tool_id = t.id
WHERE t.name = 'alice/pdf-extract';
```

Attestations:
```sql
SELECT 
    a.auditor,
    a.auditor_provider,
    a.signed_at,
    a.rekor_log_index,
    a.verified,
    a.revoked
FROM attestations a
JOIN tool_versions tv ON tv.id = a.tool_version_id
WHERE tv.tool_id = $1 AND tv.version = '2.1.0'
  AND a.revoked = false;
```

### CLI Output

```
$ enact get alice/pdf-extract

alice/pdf-extract v2.1.0
══════════════════════════════════════════════════════

Extract text and tables from PDF files

  Publisher:   alice@example.com (Google OIDC)
  License:     MIT
  Downloads:   12,503
  Rating:      ★ 4.3 (47 reviews)

Trust:
  Publisher:   ✔ Signed by alice@example.com
  Audit:       ✔ security@auditfirm.com (passed) - 2025-01-11
  Rekor:       entries 123456, 123789

Container:
  Image:       python:3.11-slim
  Timeout:     5m

Inputs:
  file*        Path to PDF file (string)
  pages        Page range, e.g., '1-5' or 'all' (string)

Outputs:
  text         Extracted text (string)
  tables       Extracted tables (array)

──────────────────────────────────────────────────────
Install:  enact install alice/pdf-extract
```

---

## 3. Install Flow

**Command:** `enact install alice/pdf-extract`

### Sequence

```
┌──────┐       ┌──────────┐       ┌────────────┐       ┌─────────┐       ┌──────────┐
│ User │       │   CLI    │       │  Registry  │       │ Storage │       │  Rekor   │
└──┬───┘       └────┬─────┘       └─────┬──────┘       └────┬────┘       └────┬─────┘
   │                │                   │                   │                 │
   │ enact install  │                   │                   │                 │
   │───────────────▶│                   │                   │                 │
   │                │                   │                   │                 │
   │                │ GET /tools/...    │                   │                 │
   │                │ /versions/2.1.0   │                   │                 │
   │                │──────────────────▶│                   │                 │
   │                │                   │                   │                 │
   │                │  version info     │                   │                 │
   │                │  + manifest       │                   │                 │
   │                │◀──────────────────│                   │                 │
   │                │                   │                   │                 │
   │                │ GET /tools/.../   │                   │                 │
   │                │ versions/.../     │                   │                 │
   │                │ attestations      │                   │                 │
   │                │──────────────────▶│                   │                 │
   │                │                   │                   │                 │
   │                │  attestation list │                   │                 │
   │                │◀──────────────────│                   │                 │
   │                │                   │                   │                 │
   │                │ GET /tools/.../   │                   │                 │
   │                │ versions/.../     │                   │                 │
   │                │ download          │                   │                 │
   │                │──────────────────▶│                   │                 │
   │                │                   │                   │                 │
   │                │                   │ Fetch from MinIO/ │                 │
   │                │                   │ S3                │                 │
   │                │                   │──────────────────▶│                 │
   │                │                   │                   │                 │
   │                │                   │◀──────────────────│                 │
   │                │                   │                   │                 │
   │                │  bundle.tar.gz    │                   │                 │
   │                │◀──────────────────│                   │                 │
   │                │                   │                   │                 │
   │                │ ┌─────────────────────────────────┐   │                 │
   │                │ │ Verify bundle hash              │   │                 │
   │                │ │ sha256(bundle) == expected_hash │   │                 │
   │                │ └─────────────────────────────────┘   │                 │
   │                │                   │                   │                 │
   │                │ ┌─────────────────────────────────┐   │                 │
   │                │ │ Verify attestation signatures   │   │                 │
   │                │ │ - Signature valid               │   │                 │
   │                │ │ - Certificate chain (Fulcio)    │   │                 │
   │                │ │ - OIDC identity matches         │   │                 │
   │                │ └─────────────────────────────────┘   │                 │
   │                │                   │                   │                 │
   │                │ Verify Rekor inclusion proof          │                 │
   │                │────────────────────────────────────────────────────────▶│
   │                │                   │                   │                 │
   │                │◀────────────────────────────────────────────────────────│
   │                │                   │                   │                 │
   │                │ ┌─────────────────────────────────┐   │                 │
   │                │ │ Apply trust policy              │   │                 │
   │                │ │ - Publisher trusted? OR         │   │                 │
   │                │ │ - Trusted auditor attested?     │   │                 │
   │                │ └─────────────────────────────────┘   │                 │
   │                │                   │                   │                 │
   │                │ ┌─────────────────────────────────┐   │                 │
   │                │ │ Extract to cache                │   │                 │
   │                │ │ ~/.enact/cache/.../2.1.0/       │   │                 │
   │                │ └─────────────────────────────────┘   │                 │
   │                │                   │                   │                 │
   │                │ ┌─────────────────────────────────┐   │                 │
   │                │ │ Install to tools directory      │   │                 │
   │                │ │ ~/.enact/tools/alice/...        │   │                 │
   │                │ └─────────────────────────────────┘   │                 │
   │                │                   │                   │                 │
   │ ✔ Installed    │                   │                   │                 │
   │◀───────────────│                   │                   │                 │
```

### Step-by-Step

| Step | Action | Details |
|------|--------|---------|
| 1 | **Resolve version** | Latest if not specified |
| 2 | **Fetch version info** | `GET /tools/{name}/versions/{version}` |
| 3 | **Fetch attestations** | `GET /tools/{name}/versions/{version}/attestations` |
| 4 | **Download bundle** | `GET /tools/{name}/versions/{version}/download` |
| 5 | **Verify hash** | `sha256(bundle) == bundle_hash` |
| 6 | **Verify attestations** | Signature, certificate chain, OIDC identity |
| 7 | **Check trust policy** | Publisher or auditor trusted? |
| 8 | **Extract to cache** | `~/.enact/cache/{tool}/{version}/` |
| 9 | **Install to tools** | `~/.enact/tools/{tool}/` or `.enact/tools/{tool}/` |

### Directory Structure After Install

```
~/.enact/
├── cache/
│   └── alice/pdf-extract/
│       └── 2.1.0/
│           ├── bundle.tar.gz       # Original bundle
│           └── metadata.json       # Attestations cache
│
├── tools/
│   └── alice/pdf-extract/          # Active installation
│       ├── enact.md                # Manifest (or enact.yaml)
│       ├── extract.py              # Tool code
│       └── requirements.txt        # Dependencies
│
├── .env                            # Global non-secret env vars
└── config.yaml                     # Configuration (registry URL, etc.)

# Secrets stored in OS keyring (namespace-level):
#   Service: enact-cli
#   Account: alice:API_TOKEN          # Shared by all alice/* tools
#   Account: alice/utils:DB_PASSWORD  # Shared by alice/utils/* tools

# Project-level installation (alternative):
my-project/.enact/
├── tools/
│   └── alice/pdf-extract/          # Project-scoped install
├── .env                            # Project env vars
└── tools.json                      # Project tool manifest
```

### CLI Output

```
$ enact install alice/pdf-extract

Downloading alice/pdf-extract@2.1.0...
Verifying bundle integrity... ✔ sha256:a1b2c3d4e5f6...

Verifying attestations...
  ✔ alice@example.com (google)
    Rekor entry: 123456

Trust check:
  ✔ Trusted auditor: alice@example.com

✔ Installed alice/pdf-extract@2.1.0 to ~/.enact/tools/
```

---

## 4. Run Flow

**Command:** `enact run alice/pdf-extract --args '{"file": "report.pdf"}'`

### Sequence

```
┌──────┐       ┌──────────┐       ┌──────────────┐       ┌───────────┐
│ User │       │   CLI    │       │    Dagger    │       │ Container │
└──┬───┘       └────┬─────┘       └──────┬───────┘       └─────┬─────┘
   │                │                    │                     │
   │ enact run ...  │                    │                     │
   │ --args '{...}' │                    │                     │
   │───────────────▶│                    │                     │
   │                │                    │                     │
   │                │ ┌────────────────────────────────┐       │
   │                │ │ Resolve tool path              │       │
   │                │ │ .enact/ → ~/.enact/tools/ →    │       │
   │                │ │ ~/.enact/cache/                │       │
   │                │ └────────────────────────────────┘       │
   │                │                    │                     │
   │                │ ┌────────────────────────────────┐       │
   │                │ │ Parse enact.md (or enact.yaml) │       │
   │                │ │ - from: python:3.11-slim       │       │
   │                │ │ - command: python extract.py   │       │
   │                │ │ - inputSchema: {...}           │       │
   │                │ └────────────────────────────────┘       │
   │                │                    │                     │
   │                │ ┌────────────────────────────────┐       │
   │                │ │ Validate inputs against schema │       │
   │                │ └────────────────────────────────┘       │
   │                │                    │                     │
   │                │ ┌────────────────────────────────┐       │
   │                │ │ Load secrets (env secret:true) │       │
   │                │ │ from OS keyring (namespace     │       │
   │                │ │ inheritance)                   │       │
   │                │ └────────────────────────────────┘       │
   │                │                    │                     │
   │                │ ┌────────────────────────────────┐       │
   │                │ │ Load env vars (secret:false)   │       │
   │                │ │ .enact/.env → ~/.enact/.env    │       │
   │                │ └────────────────────────────────┘       │
   │                │                    │                     │
   │                │ ┌────────────────────────────────┐       │
   │                │ │ Interpolate command            │       │
   │                │ │ python extract.py              │       │
   │                │ │   --file='report.pdf'          │       │
   │                │ └────────────────────────────────┘       │
   │                │                    │                     │
   │                │ Build container    │                     │
   │                │───────────────────▶│                     │
   │                │                    │                     │
   │                │                    │ Pull image          │
   │                │                    │ python:3.11-slim    │
   │                │                    │────────────────────▶│
   │                │                    │                     │
   │                │                    │ Mount tool source   │
   │                │                    │ Mount input file    │
   │                │                    │ Set env vars        │
   │                │                    │────────────────────▶│
   │                │                    │                     │
   │                │                    │ Execute command     │
   │                │                    │────────────────────▶│
   │                │                    │                     │
   │                │                    │                     │ python extract.py
   │                │                    │                     │ --file='report.pdf'
   │                │                    │                     │
   │                │                    │      stdout/stderr  │
   │                │                    │◀────────────────────│
   │                │                    │                     │
   │                │    Output JSON     │                     │
   │                │◀───────────────────│                     │
   │                │                    │                     │
   │ {"text":       │                    │                     │
   │  "...",        │                    │                     │
   │  "tables": []} │                    │                     │
   │◀───────────────│                    │                     │
```

### Step-by-Step

| Step | Action | Details |
|------|--------|---------|
| 1 | **Resolve path** | Project `.enact/tools/` → User `~/.enact/tools/` → Cache |
| 2 | **Parse manifest** | Read `enact.md` YAML frontmatter (or `enact.yaml`) |
| 3 | **Validate inputs** | Check against `inputSchema` using JSON Schema |
| 4 | **Load secrets** | `env` entries with `secret: true` from OS keyring |
| 5 | **Load env vars** | `env` entries without `secret` from `.env` files |
| 6 | **Build command** | Interpolate `${args}` into command template |
| 7 | **Create container** | Dagger: image + source + files + secrets + env |
| 8 | **Execute** | Run command with timeout (default 5m) |
| 9 | **Return output** | Capture stdout, parse if JSON |

**Note:** Tools without a `command` field (instruction-only tools) display their markdown content instead of executing.

### Container Sandbox

```
┌─────────────────────────────────────────────────────────┐
│  Container: python:3.11-slim                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  /workspace/                                            │
│  ├── enact.md           <- Tool manifest                │
│  ├── extract.py         <- Tool code                    │
│  ├── requirements.txt   <- Dependencies                 │
│  └── report.pdf         <- User's input file            │
│                                                         │
│  SECRETS (from OS keyring via Dagger):                  │
│    API_TOKEN      <- alice:API_TOKEN (namespace-level)  │
│                                                         │
│  ENV (from .env files):                                 │
│    LOG_LEVEL=debug         (from .enact/.env)           │
│    TESSDATA_PATH=/usr/...  (from ~/.enact/.env)         │
│                                                         │
│  ISOLATION:                                             │
│    ✗ No host filesystem access                          │
│    ✗ No network (unless explicitly allowed)             │
│    ✔ Secrets in memory only (never on disk)             │
│    ✔ Timeout enforced (default 5m)                      │
│                                                         │
│  EXEC:                                                  │
│    $ python extract.py --file='report.pdf' --pages='1-5'│
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### CLI Output

```
$ enact run alice/pdf-extract --args '{"file": "report.pdf", "pages": "1-5"}'

{
  "text": "Annual Report 2024\n\nExecutive Summary\n\n...",
  "tables": [
    {
      "page": 2,
      "headers": ["Quarter", "Revenue", "Growth"],
      "rows": [
        ["Q1", "$1.2M", "12%"],
        ["Q2", "$1.5M", "25%"]
      ]
    }
  ]
}
```

**Instruction-only tools** (no `command` field) display their markdown content:

```
$ enact run alice/greeter

══════════════════════════════════════════════════════
alice/greeter v2.1.0
══════════════════════════════════════════════════════

# Greeter Tool

This is a simple greeting tool that demonstrates
the enact.md format.

## Usage

Say hello to someone!

──────────────────────────────────────────────────────
```

---

## Attestation Verification

Attestations are cryptographic proofs about a tool. Enact uses two types:

- **Publisher Attestation** - Proves the tool was published by a specific identity
- **Audit Attestation** - Proves a third-party auditor reviewed the tool

### Attestation Format (in-toto)

All attestations use the [in-toto](https://in-toto.io) statement format:

```json
{
  "_type": "https://in-toto.io/Statement/v1",
  "subject": [{
    "name": "alice/pdf-extract@2.1.0",
    "digest": { "sha256": "a1b2c3d4e5f6..." }
  }],
  "predicateType": "https://enact.tools/attestation/tool/v1",
  "predicate": {
    "type": "https://enact.tools/attestation/tool/v1",
    "tool": {
      "name": "pdf-extract",
      "version": "2.1.0",
      "publisher": "alice@example.com"
    }
  }
}
```

### Predicate Types

| Type | URI | Purpose |
|------|-----|---------|
| Publisher | `https://enact.tools/attestation/tool/v1` | Tool authenticity |
| Audit | `https://enact.tools/attestation/audit/v1` | Security review |
| SLSA | `https://slsa.dev/provenance/v1` | Build provenance |

### Sigstore Bundle

Attestations are wrapped in Sigstore bundles containing:

```json
{
  "mediaType": "application/vnd.dev.sigstore.bundle+json;version=0.2",
  "verificationMaterial": {
    "certificate": {
      "rawBytes": "<base64 Fulcio certificate>"
    },
    "tlogEntries": [{
      "logIndex": "123456",
      "logId": { "keyId": "..." },
      "inclusionProof": { ... }
    }]
  },
  "dsseEnvelope": {
    "payload": "<base64 in-toto statement>",
    "payloadType": "application/vnd.in-toto+json",
    "signatures": [{ "sig": "..." }]
  }
}
```

### Verification Steps

| Check | What it proves |
|-------|----------------|
| **Signature valid** | Attestation wasn't tampered with |
| **Certificate chain** | Certificate issued by Fulcio CA |
| **OIDC identity** | Signer is who they claim (email, GitHub workflow, etc.) |
| **Subject digest** | Attestation is for this specific bundle hash |
| **Rekor inclusion** | Attestation exists in public transparency log |
| **Certificate validity** | Certificate was valid at signing time |

### Trust Decision

```python
def should_install(publisher_attestation, audit_attestations, trust_policy):
    # Step 1: Verify publisher attestation exists (required)
    if not publisher_attestation:
        if trust_policy.allow_unsigned:
            return True  # Permissive policy
        return False
    
    # Step 2: Check if publisher is trusted
    publisher_identity = extract_identity(publisher_attestation)
    publisher_trusted = matches_trusted_identity(
        publisher_identity, 
        trust_policy.trusted_publishers
    )
    
    # Step 3: Check audit requirements
    if trust_policy.require_audit:
        for audit in audit_attestations:
            auditor_identity = extract_identity(audit)
            if matches_trusted_identity(auditor_identity, trust_policy.trusted_auditors):
                return publisher_trusted  # Both publisher + auditor required
        return False  # No trusted auditor found
    
    return publisher_trusted
```

### Trust Policy Configuration

```yaml
# ~/.enact/trust-policy.yaml
name: my-policy
version: "1.0"

trustedPublishers:
  - identity: alice@example.com
    issuer: https://accounts.google.com
  - identity: "https://github.com/myorg/*"  # Wildcard for GitHub org
    issuer: https://token.actions.githubusercontent.com

trustedAuditors:
  - identity: security@auditfirm.com
    issuer: https://accounts.google.com
  - identity: "https://github.com/ossf/*"
    issuer: https://token.actions.githubusercontent.com

requireAttestation: true   # Reject unsigned tools
requireAudit: false        # Don't require audit attestation
allowUnsigned: false       # Don't allow unsigned tools
```

**Identity Patterns:**

| Pattern | Matches |
|---------|--------|
| `alice@example.com` | Exact email match |
| `*@example.com` | Any email from domain |
| `https://github.com/myorg/*` | Any repo in GitHub org |
| `https://github.com/myorg/repo` | Specific GitHub repo |

---

## Database Schema Summary

### Core Tables

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    profiles     │     │     tools       │     │  tool_versions  │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (PK)         │────▶│ id (PK)         │────▶│ id (PK)         │
│ username (UK)   │     │ owner_id (FK)   │     │ tool_id (FK)    │
│ display_name    │     │ name (UK)       │     │ version         │
│ avatar_url      │     │ short_name      │     │ manifest (JSON) │
│ created_at      │     │ description     │     │ readme          │
└─────────────────┘     │ license         │     │ bundle_hash     │
                        │ tags            │     │ bundle_size     │
                        │ repository_url  │     │ bundle_path     │
                        │ homepage_url    │     │ downloads       │
                        │ total_downloads │     │ yanked          │
                        │ created_at      │     │ yank_reason     │
                        │ updated_at      │     │ published_by    │
                        └─────────────────┘     │ published_at    │
                                                └─────────────────┘
                                                        │
                                                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│trusted_auditors │     │    reports      │     │  attestations   │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ user_id (FK)    │     │ id (PK)         │     │ id (PK)         │
│ auditor_identity│     │ tool_version_id │     │ tool_version_id │
│ created_at      │     │ reporter_id     │     │ auditor         │
└─────────────────┘     │ severity        │     │ auditor_provider│
                        │ category        │     │ bundle (JSON)   │
                        │ description     │     │ rekor_log_id    │
                        │ status          │     │ rekor_log_index │
                        │ created_at      │     │ signed_at       │
                        └─────────────────┘     │ verified        │
                                                │ revoked         │
                                                │ created_at      │
                                                └─────────────────┘
```

### Key Relationships

| From | To | Relationship |
|------|----|--------------|
| `profiles` | `tools` | User owns tools (owner_id) |
| `tools` | `tool_versions` | Tool has versions |
| `tool_versions` | `attestations` | Version has attestations |
| `profiles` | `tool_versions` | User publishes versions (published_by) |
| `profiles` | `trusted_auditors` | User trusts auditors |
| `tool_versions` | `reports` | Version can be reported |

### Storage

| Data | Location |
|------|----------|
| Metadata | PostgreSQL |
| Bundles | Object storage (S3/GCS/R2) via `bundle_url` |
| Embeddings | PostgreSQL with pgvector |
| Attestations | PostgreSQL (sigstore_bundle JSON) |

---

## Quick Reference

### CLI Commands

| Command | Purpose |
|---------|---------|
| `enact search "query"` | Semantic search for tools |
| `enact get <tool>` | View tool details and manifest |
| `enact install <tool>` | Download, verify, install |
| `enact run <tool> --args '{}'` | Execute in sandbox |
| `enact trust <identity>` | Add trusted publisher |
| `enact trust <identity> --auditor` | Add trusted auditor |
| `enact trust -r <identity>` | Remove trusted identity |
| `enact trust list` | List all trusted identities |
| `enact trust check <tool>` | View trust status |
| `enact sign <tool>` | Sign tool as publisher |
| `enact sign <tool> --audit` | Sign audit attestation |
| `enact env set KEY --secret` | Store secret in OS keyring |
| `enact env get KEY --secret` | Check if secret exists |
| `enact env list --secret` | List secrets |
| `enact env set <key> <value>` | Set non-secret env var |
| `enact env list` | List all env vars |


### API Endpoints

| Endpoint | Purpose |
|----------|---------|
| `GET /tools/search?q=` | Hybrid semantic + text search |
| `GET /tools/{name}` | Tool metadata + versions |
| `GET /tools/{name}/versions/{v}` | Version details + manifest |
| `GET /tools/{name}/versions/{v}/download` | Download tool bundle |
| `GET /tools/{name}/versions/{v}/attestations` | List attestations |
| `POST /tools/{name}/versions/{v}/attestations` | Submit attestation |
| `DELETE /tools/{name}/versions/{v}/attestations?auditor=` | Revoke attestation |
| `POST /tools/{name}` | Publish tool (multipart form) |
| `POST /tools/{name}/versions/{v}/yank` | Yank a version |
| `POST /tools/{name}/versions/{v}/unyank` | Unyank a version |
| `DELETE /tools/{name}` | Delete tool |

### File Locations

| Path | Purpose |
|------|---------|
| `~/.enact/tools/` | Installed tools (global) |
| `~/.enact/cache/` | Downloaded bundles (immutable) |
| `~/.enact/.env` | Global non-secret env vars |
| `.enact/tools/` | Installed tools (project) |
| `.enact/.env` | Project-level env var overrides |
| `~/.enact/config.yaml` | General configuration |
| OS Keyring (`enact-cli`) | Secrets (namespace-scoped) |

---

## Local Development

### Prerequisites

- Docker Desktop running
- Supabase CLI (`brew install supabase/tap/supabase`)
- Bun (`curl -fsSL https://bun.sh/install | bash`)

### Starting Local Infrastructure

```bash
# Start Supabase (PostgreSQL, Edge Functions, Studio)
cd packages/server
supabase start

# Start MinIO (S3-compatible object storage)
docker-compose up -d

# Serve Edge Functions with MinIO credentials
supabase functions serve --no-verify-jwt --env-file supabase/.env.local
```

### Local URLs

| Service | URL |
|---------|-----|
| **Registry API** | `http://127.0.0.1:54321/functions/v1` |
| **Supabase Studio** | `http://127.0.0.1:54323` |
| **MinIO Console** | `http://127.0.0.1:9001` (minioadmin/minioadmin) |
| **MinIO S3 API** | `http://127.0.0.1:9000` |
| **PostgreSQL** | `postgresql://postgres:postgres@127.0.0.1:54322/postgres` |

### Environment Variables

Set the registry URL for CLI commands:

```bash
export ENACT_REGISTRY_URL="http://127.0.0.1:54321/functions/v1"
```

Or add to `~/.enact/config.yaml`:

```yaml
registry:
  url: http://127.0.0.1:54321/functions/v1
```

### Publishing Locally

```bash
# Create a test user JWT
export TEST_JWT=$(node -e "
  const jwt = require('jsonwebtoken');
  console.log(jwt.sign(
    { sub: 'your-user-id', role: 'authenticated' },
    'super-secret-jwt-token-with-at-least-32-characters-long'
  ));
")

# Publish a tool
ENACT_REGISTRY_URL="http://127.0.0.1:54321/functions/v1" \
ENACT_AUTH_TOKEN="$TEST_JWT" \
enact publish ./my-tool
```

### Full Workflow Example

```bash
# 1. Publish a tool
enact publish ./examples/greeter

# 2. Search for it
enact search greeter

# 3. Install it
enact install testuser/greeter

# 4. Run it
enact run testuser/greeter
```
