import { createAppAuth } from "@octokit/auth-app";
import { createOAuthAppAuth } from "@octokit/auth-oauth-app";
import { OctokitOptions } from "@octokit/core/dist-types/types";
import { ThrottlingOptions } from "@octokit/plugin-throttling/dist-types/types";
import { Octokit } from "@octokit/rest";
import { Logger, validate } from "opstooling-js";

import { GitHubConfigOpts } from "src/github";
import { GitHubInstance, GitHubOptions } from "src/github/types";
import {
  GitHubAppAuthSchema,
  GitHubAppInstallationAuthSchema,
  GitHubAppOAuthSchema,
  GitHubTokenAuthSchema,
} from "src/schemas/GitHubConfigEnvSchema";
import {
  GitHubAppAuthEnv,
  GitHubAppInstallationAuthEnv,
  GitHubAppOAuthEnv,
  GitHubTokenAuthEnv,
} from "src/types/generated";
import { defaultLogger, lazyApi } from "src/utils";

export function getInstance(opts: GitHubConfigOpts): Promise<GitHubInstance> {
  let authStrategy: OctokitOptions["authStrategy"];
  let auth: OctokitOptions["auth"];

  switch (opts.authType) {
    case "app":
      authStrategy = createAppAuth;
      auth = { appId: opts.appId, privateKey: opts.privateKey };
      break;
    case "installation":
      authStrategy = createAppAuth;
      auth = { appId: opts.appId, installationId: opts.installationId, privateKey: opts.privateKey };
      break;
    case "oauth":
      authStrategy = createOAuthAppAuth;
      auth = { clientId: opts.clientId, clientSecret: opts.clientSecret };
      break;
    case "token":
      auth = opts.authToken;
  }

  const throttle: ThrottlingOptions = {
    // Options are typed as `any` in octokit/plugin-throttling
    /* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/restrict-template-expressions */
    onRateLimit: (retryAfter, options: any, octokit, retryCount) => {
      octokit.log.warn(`Request quota exhausted for request ${options.method} ${options.url}`);

      if (retryCount < 3) {
        octokit.log.info(`Retrying after ${retryAfter} seconds!`);
        return true;
      }
    },
    onSecondaryRateLimit: (retryAfter, options: any, octokit, retryCount) => {
      // does not retry, only logs a warning
      octokit.log.warn(`SecondaryRateLimit detected for request ${options.method} ${options.url}`);

      if (retryCount < 3) {
        octokit.log.info(`Retrying after ${retryAfter} seconds!`);
        return true;
      }
    },
    /* eslint-enable @typescript-eslint/no-explicit-any,@typescript-eslint/restrict-template-expressions */
  };

  // Octokit is typed with a bunch of `any`s
  /* eslint-disable @typescript-eslint/no-unsafe-assignment */
  const octokitInstance = new Octokit({
    authStrategy,
    auth,
    baseUrl: opts.apiEndpoint ?? "https://api.github.com",
    throttle,
  });
  const token = auth.token;

  return Promise.resolve({ ...octokitInstance, token });
  /* eslint-enable @typescript-eslint/no-unsafe-assignment */
}

export type Setup = {
  octokit: GitHubInstance;
  logger: Logger;
};

export async function resolveSetup(options?: GitHubOptions): Promise<Setup> {
  const octokit: GitHubInstance = options?.octokitInstance ?? (await setupCommonInstance(getConfigOptsFromEnv()));
  const logger = options?.logger ?? defaultLogger;

  bindLogger(octokit, logger);

  return { octokit, logger };
}

export function bindLogger(octokit: Octokit, logger: Logger): void {
  octokit.log = Object.assign(octokit.log, {
    debug: logger.log.bind(logger, "debug"),
    info: logger.info.bind(logger),
    warn: logger.warn.bind(logger),
    error: logger.error.bind(logger),
  });
}

export const setupCommonInstance: (opts: GitHubConfigOpts) => Promise<GitHubInstance> = lazyApi(getInstance);

export function getConfigOptsFromEnv(): GitHubConfigOpts {
  const message = "Invalid environment for GitHub integration. Consult README.md";

  if (process.env.GITHUB_PRIVATE_KEY_BASE64 && !process.env.GITHUB_PRIVATE_KEY) {
    process.env.GITHUB_PRIVATE_KEY = Buffer.from(process.env.GITHUB_PRIVATE_KEY_BASE64, "base64").toString();
  }

  if (process.env.GITHUB_AUTH_TYPE === "app") {
    const appAuthEnv = validate<GitHubAppAuthEnv>(process.env, GitHubAppAuthSchema, { message });
    return {
      authType: "app",
      ...(appAuthEnv.GITHUB_BASE_URL && { apiEndpoint: appAuthEnv.GITHUB_BASE_URL }),
      appId: appAuthEnv.GITHUB_APP_ID,
      privateKey: appAuthEnv.GITHUB_PRIVATE_KEY,
    };
  } else if (process.env.GITHUB_AUTH_TYPE === "installation") {
    const installationAuthEnv = validate<GitHubAppInstallationAuthEnv>(process.env, GitHubAppInstallationAuthSchema, {
      message,
    });
    return {
      authType: "installation",
      ...(installationAuthEnv.GITHUB_BASE_URL && { apiEndpoint: installationAuthEnv.GITHUB_BASE_URL }),
      appId: installationAuthEnv.GITHUB_APP_ID,
      privateKey: installationAuthEnv.GITHUB_PRIVATE_KEY,
      installationId: installationAuthEnv.GITHUB_INSTALLATION_ID,
    };
  } else if (process.env.GITHUB_AUTH_TYPE === "oauth") {
    const installationPrivkeyAuthEnv = validate<GitHubAppOAuthEnv>(process.env, GitHubAppOAuthSchema, { message });
    return {
      authType: "oauth",
      ...(installationPrivkeyAuthEnv.GITHUB_BASE_URL && { apiEndpoint: installationPrivkeyAuthEnv.GITHUB_BASE_URL }),
      clientId: installationPrivkeyAuthEnv.GITHUB_CLIENT_ID,
      clientSecret: installationPrivkeyAuthEnv.GITHUB_CLIENT_SECRET,
    };
  } else {
    const tokenAuthEnv = validate<GitHubTokenAuthEnv>(process.env, GitHubTokenAuthSchema, { message });
    return {
      authType: "token",
      ...(tokenAuthEnv.GITHUB_BASE_URL && { apiEndpoint: tokenAuthEnv.GITHUB_BASE_URL }),
      authToken: tokenAuthEnv.GITHUB_TOKEN,
    };
  }
}

export async function getFetchEndpoint(options?: GitHubOptions): Promise<{ token: string; url: string }> {
  const setup = await resolveSetup(options);
  return { url: `https://x-access-token:${setup.octokit.token}@github.com`, token: setup.octokit.token };
}
