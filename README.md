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

| Environment variable   | Option for getInstance() | Description                                                       | Required?                                      | Default value            |
|------------------------|--------------------------|-------------------------------------------------------------------|------------------------------------------------|--------------------------|
| GITHUB_AUTH_TYPE       | authType                 | How to authorize in GitHub. Can be `token`, `app`, `installation` | no                                             | `token`                  |
| GITHUB_APP_ID          | appId                    | GitHub app ID                                                     | yes, if `authType` is `app`, or `installation` | -                        |
| GITHUB_CLIENT_ID       | clientId                 | GitHub client ID                                                  | yes, if `authType` is `app` or `installation`                   | -                        |
| GITHUB_CLIENT_SECRET   | clientSecret             | GitHub client secret                                              | yes, if `authType` is `app` or `installation`                    | -                        |
| GITHUB_PRIVATE_KEY     | privateKey               | GitHub app private key                                            | yes, if `authType` is `app` or `installation`                    | -                        |
| GITHUB_TOKEN           | authToken                | GitHub auth token. Can be personal, oauth, etc.                   | yes, if `authType` is `token`                  | -                        |
| GITHUB_INSTALLATION_ID | installationId           | GitHub app installation id                                        | if `authType` is `installation`                | -                        |
| GITHUB_BASE_URL        | baseUrl                  | API endpoint URL                                                  | no                                             | `https://api.github.com` |
