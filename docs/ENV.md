# **Environment Variables Management v2.0 — Keyring Edition**

*Enact System Design Document*

---

## 1. Overview

Environment Variables Management v2.0 provides secure, cross-platform secret handling for Enact using OS-native keyring storage as the default, with support for alternative secret sources via Dagger's secret URI scheme.

Core properties:

* Zero secrets written to disk
* Cross-platform support (macOS Keychain, Windows Credential Manager, Linux Secret Service)
* Namespace-scoped secrets with inheritance
* Fallback to Dagger secret providers for CI/headless environments
* Seamless integration with Dagger's typed Secret API

---

## 2. Architectural Principles

### 2.1. Secrets live only in the OS keyring (by default)

On developer machines, Enact stores and retrieves secrets from the OS keyring. Secrets are never written to disk.

### 2.2. Secrets are namespace-scoped

Secrets are stored at namespace paths and inherited by all tools within that namespace. Tools declare what secrets they need; namespaces provide them.

### 2.3. Secrets are ephemeral at runtime

Values are:
1. Loaded from keyring (or alternative source)
2. Held in memory briefly
3. Passed into Dagger as typed secret objects
4. Destroyed when the process exits

### 2.4. Leverage existing infrastructure

OS keyrings for developer machines. Dagger's secret providers (Vault, 1Password, environment variables) for CI and headless environments.

---

## 3. Secret Identifier Format

### 3.1. Service Name

All keyring secrets are stored under:

```
enact-cli
```

### 3.2. Account Identifier

```
{namespace}:{SECRET_NAME}
```

Examples:

```
alice/api:API_TOKEN
acme-corp/data:DATABASE_URL
research/ml:HF_API_KEY
```

### 3.3. Namespace Inheritance

When a tool requests a secret, Enact walks up the namespace path:

```
Tool: alice/api/slack/notifier
Needs: API_TOKEN

Lookup:
  1. alice/api/slack:API_TOKEN
  2. alice/api:API_TOKEN ✓ found
  3. alice:API_TOKEN
```

First match wins.

---

## 4. CLI Commands

### 4.1. `enact secret set <namespace> <secretName>`

```
$ enact secret set alice/api API_TOKEN
Enter secret value for API_TOKEN: *************
✓ Secret 'API_TOKEN' stored securely.
  Available to: alice/api/*
```

### 4.2. `enact secret get <namespace> <secretName>`

Checks existence (never prints value).

```
$ enact secret get alice/api API_TOKEN
✓ Secret 'API_TOKEN' exists at alice/api
```

### 4.3. `enact secret list <namespace>`

```
$ enact secret list alice/api
API_TOKEN
SLACK_WEBHOOK
```

### 4.4. `enact secret delete <namespace> <secretName>`

```
$ enact secret delete alice/api API_TOKEN
✓ Secret 'API_TOKEN' removed from system keyring.
```

### 4.5. `enact secret resolve <tool>`

Shows resolution for a specific tool.

```
$ enact secret resolve alice/api/slack/notifier

Required secrets:
  API_TOKEN      ← alice/api:API_TOKEN ✓
  SLACK_WEBHOOK  ← alice/api:SLACK_WEBHOOK ✓
  ORG_ID         ← alice:ORG_ID ✓
```

---

## 5. Manifest Declaration

Tools declare required secrets in `enact.md`:

```yaml
secrets:
  - API_TOKEN
  - SLACK_WEBHOOK
```

If a secret can't be resolved:

```
✗ Tool 'alice/api/slack/notifier' requires secret 'API_TOKEN'.
  
  Searched:
    alice/api/slack:API_TOKEN ✗
    alice/api:API_TOKEN ✗
    alice:API_TOKEN ✗

  Set it with: enact secret set <namespace> API_TOKEN
```

---

## 6. Non-Secret Environment Variables

Non-sensitive configuration is declared separately:

```yaml
env:
  LOG_LEVEL:
    description: "Logging verbosity"
    default: "info"
  API_BASE_URL:
    description: "API endpoint"
    default: "https://api.example.com"
```

These are injected as regular environment variables and may appear in logs.

---

## 7. Alternative Secret Sources

For CI/CD pipelines, headless servers, or environments without a keyring, secrets can be provided at runtime using Dagger's secret URI scheme.

### 7.1. Runtime Override

```bash
enact run alice/api/slack --secret API_TOKEN=env://API_TOKEN
```

This bypasses keyring lookup for `API_TOKEN` and sources it from the environment variable instead.

### 7.2. Supported Providers

| Provider | URI Format | Example |
|----------|------------|---------|
| Environment variable | `env://VAR_NAME` | `env://API_TOKEN` |
| File | `file://PATH` | `file://./secrets/token.txt` |
| Command output | `cmd://COMMAND` | `cmd://"gh auth token"` |
| 1Password | `op://VAULT/ITEM/FIELD` | `op://infra/github/credential` |
| HashiCorp Vault | `vault://PATH` | `vault://credentials.api_token` |

### 7.3. CI/CD Examples

**GitHub Actions:**

```yaml
- name: Run tool
  run: |
    enact run alice/api/slack \
      --secret API_TOKEN=env://API_TOKEN \
      --secret SLACK_WEBHOOK=env://SLACK_WEBHOOK
  env:
    API_TOKEN: ${{ secrets.API_TOKEN }}
    SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }}
```

**Using 1Password (with service account):**

```yaml
- name: Run tool
  run: |
    enact run alice/api/slack \
      --secret API_TOKEN=op://infra/api/token \
      --secret SLACK_WEBHOOK=op://infra/slack/webhook
  env:
    OP_SERVICE_ACCOUNT_TOKEN: ${{ secrets.OP_SERVICE_ACCOUNT_TOKEN }}
```

**Using HashiCorp Vault:**

```yaml
- name: Run tool
  run: |
    enact run alice/api/slack \
      --secret API_TOKEN=vault://secret/data/api#token
  env:
    VAULT_ADDR: ${{ secrets.VAULT_ADDR }}
    VAULT_TOKEN: ${{ secrets.VAULT_TOKEN }}
```

### 7.4. Mixed Sources

You can mix keyring and override sources. Unspecified secrets fall back to keyring lookup:

```bash
# API_TOKEN from Vault, SLACK_WEBHOOK from keyring
enact run alice/api/slack --secret API_TOKEN=vault://credentials.token
```

---

## 8. Dagger Integration

During `enact run`:

1. Read manifest `secrets` list
2. For each secret:
   - If `--secret NAME=uri` provided, use Dagger's secret resolution
   - Otherwise, resolve via namespace inheritance from keyring
3. Create typed Dagger secrets:

```ts
// From keyring
const value = await resolveSecret(toolPath, key);
const secretObj = client.setSecret(key, value);

// From URI (passed through to Dagger)
const secretObj = dag.secret(uri);
```

4. Inject into container:

```ts
container = container.withSecretVariable(key, secretObj);
```

5. Execute container
6. Secrets destroyed on exit

Credentials never appear in filesystem, logs, or process table.

---

## 9. Reference Implementation

```ts
import { keyring } from "@zowe/secrets-for-zowe-sdk";
import { dag } from "@dagger.io/dagger";

const SERVICE = "enact-cli";

export async function setSecret(namespace: string, key: string, value: string) {
  const account = `${namespace}:${key}`;
  await keyring.setPassword(SERVICE, account, value);
}

export async function getSecret(namespace: string, key: string) {
  const account = `${namespace}:${key}`;
  return await keyring.getPassword(SERVICE, account);
}

export async function resolveSecret(toolPath: string, key: string) {
  const segments = toolPath.split('/');
  
  for (let i = segments.length; i > 0; i--) {
    const namespace = segments.slice(0, i).join('/');
    const value = await getSecret(namespace, key);
    if (value) return { namespace, value };
  }
  
  return null;
}

export async function getSecretObject(
  toolPath: string,
  key: string,
  override?: string
) {
  if (override) {
    // Use Dagger's native secret resolution
    return dag.secret(override);
  }
  
  // Fall back to keyring
  const resolved = await resolveSecret(toolPath, key);
  if (!resolved) {
    throw new Error(`Secret '${key}' not found for tool '${toolPath}'`);
  }
  return dag.setSecret(key, resolved.value);
}
```

---

## 10. Security Properties

| Property | Guarantee |
|----------|-----------|
| At rest (keyring) | OS-encrypted storage |
| At rest (Vault/1Password) | Provider-managed encryption |
| Access control | OS authentication or provider auth |
| At runtime | Memory-only, passed via Dagger secret API |
| In logs | Never logged (Dagger scrubs secret values) |
| On disk | Never written |

---

## 11. Summary

- **Developer machines**: Secrets stored in OS keyring, namespace inheritance for sharing
- **CI/Headless**: Override with `--secret NAME=uri` using Dagger providers
- **Flexibility**: Mix keyring and external providers as needed
- **Security**: Secrets never touch disk, scrubbed from logs by Dagger