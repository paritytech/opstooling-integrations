# opstooling-integrations

### Reusable third party integrations library

All integrations are unified under similar API, with following rules in mind:

* Setup/configuration is supported in two ways:
    * Automatic (static): all options are in environment variables, and setup is performed on first execution of any
      method.
    * Manual: use `getInstance(opts)` method from an integration, and pass the instance as a parameter to each method.
      This allows to have more than one instance of integration. One example why this is needed, are
      installation-authenticated instances of `github` in `cla-bot-2021`.
* Mocks are provided for each query, but fixtures are added when needed.
* All retry / rate-limiting logic should also be implemented in this module.

#### Using mocks and fixtures

```ts
// module.ts
import { github } from "opstooling-integrations";

export async function foo() {
  await github.createCommitStatus({...});
}
```

```ts
// module.spec.ts
import { describe, expect, it, jest } from "@jest/globals";
import { fixtures, github } from "opstooling-integrations";
import { foo } from ".";

jest.mock("opstooling-integrations");

describe("foo", () => {
  it("calls github.createCommitStatus", async () => {
  jest.mocked(github.createCommitStatus).mockResolvedValue(fixtures.github.createCommitStatusSuccessfulResponse());
    await foo();

    expect(github.createCommitStatus).toHaveBeenCalledWith({...});
  });
});
```

## Integrations

### GitHub

#### Configuration

Four auth types are supported: `app`, `installation`, and `token`.

###### `app` auth

Non-installation auth type for GitHub Apps. Using this means that org/repo permissions aren't accessible.  
Requires `appId` and `privateKey`.

###### `installation` auth

This type is used to authorize requests for specific org/repo application installation. Requires `installationId`,
which can be resolved using `app` auth. If app expected to have only one installation, then it can be configured through
environment. Otherwise, use `github.getInstance` and pass the instance further.  
Requires `appId`, `privateKey` and `installationId`.

###### `token` auth

Simplest of all, requires only `token`, works for personal tokens or oauth tokens.

| Environment variable                            | Option for getInstance() | Description                                                                             | Required?                                      | Default value            |
|-------------------------------------------------|--------------------------|-----------------------------------------------------------------------------------------|------------------------------------------------|--------------------------|
| GITHUB_AUTH_TYPE                                | authType                 | `app`, `token`, `installation`                                                          | no                                             | `token`                  |
| GITHUB_APP_ID                                   | appId                    | GitHub app ID                                                                           | yes, if `authType` is `app`, or `installation` | -                        |
| GITHUB_PRIVATE_KEY or GITHUB_PRIVATE_KEY_BASE64 | privateKey               | GitHub app private key. <br/>Use GITHUB_PRIVATE_KEY_BASE64 to curcumvent newline issues | yes, if `authType` is `app` or `installation`  | -                        |
| GITHUB_TOKEN                                    | authToken                | GitHub auth token. Can be personal, oauth, etc.                                         | yes, if `authType` is `token`                  | -                        |
| GITHUB_INSTALLATION_ID                          | installationId           | GitHub app installation id                                                              | if `authType` is `installation`                | -                        |
| GITHUB_BASE_URL                                 | baseUrl                  | API endpoint URL                                                                        | no                                             | `https://api.github.com` |
