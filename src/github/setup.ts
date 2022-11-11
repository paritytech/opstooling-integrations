import { createAppAuth } from "@octokit/auth-app";
import { OctokitOptions } from "@octokit/core/dist-types/types";
import { ThrottlingOptions } from "@octokit/plugin-throttling/dist-types/types";
import { Octokit } from "@octokit/rest";
import { Logger, validate } from "opstooling-js";

import { GitHubConfigOpts } from "src/github";
import {
  GitHubAppAuthSchema,
  GitHubAppInstallationAuthSchema,
  GitHubTokenAuthSchema,
} from "src/schemas/GitHubConfigEnvSchema";
import { GitHubAppAuthEnv, GitHubAppInstallationAuthEnv, GitHubTokenAuthEnv } from "src/types/generated";
import { lazyApi } from "src/utils";

export function getInstance(opts: GitHubConfigOpts): Promise<Octokit> {
  let authStrategy: OctokitOptions["authStrategy"];
  let auth: OctokitOptions["auth"];

  switch (opts.authType) {
    case "app":
    case "installation":
      authStrategy = createAppAuth;
      auth = {
        appId: opts.appId,
        clientId: opts.clientId,
        clientSecret: opts.clientSecret,
        privateKey: opts.privateKey,
      };
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
  return Promise.resolve(
    new Octokit({ authStrategy, auth, baseUrl: opts.apiEndpoint ?? "https://api.github.com", throttle }),
  );
  /* eslint-enable @typescript-eslint/no-unsafe-assignment */
}

export function bindLogger(octokit: Octokit, logger: Logger): void {
  octokit.log = Object.assign(octokit.log, {
    debug: logger.log.bind(logger, "debug"),
    info: logger.info.bind(logger),
    warn: logger.warn.bind(logger),
    error: logger.error.bind(logger),
  });
}

export const setupCommonInstance: (opts: GitHubConfigOpts) => Promise<Octokit> = lazyApi(getInstance);

export function getConfigOptsFromEnv(): GitHubConfigOpts {
  const message = "Invalid environment for GitHub integration. Consult README.md";

  if (process.env.GITHUB_AUTH_TYPE === "app") {
    const appAuthEnv: GitHubAppAuthEnv = validate<GitHubAppAuthEnv>(process.env, GitHubAppAuthSchema, { message });
    return {
      authType: "app",
      ...(appAuthEnv.GITHUB_BASE_URL && { apiEndpoint: appAuthEnv.GITHUB_BASE_URL }),
      appId: appAuthEnv.GITHUB_APP_ID,
      clientId: appAuthEnv.GITHUB_CLIENT_ID,
      clientSecret: appAuthEnv.GITHUB_CLIENT_SECRET,
      privateKey: appAuthEnv.GITHUB_PRIVATE_KEY,
    };
  } else if (process.env.GITHUB_AUTH_TYPE === "installation") {
    const installationAuthEnv: GitHubAppInstallationAuthEnv = validate<GitHubAppInstallationAuthEnv>(
      process.env,
      GitHubAppInstallationAuthSchema,
      { message },
    );
    return {
      authType: "installation",
      ...(installationAuthEnv.GITHUB_BASE_URL && { apiEndpoint: installationAuthEnv.GITHUB_BASE_URL }),
      appId: installationAuthEnv.GITHUB_APP_ID,
      clientId: installationAuthEnv.GITHUB_CLIENT_ID,
      clientSecret: installationAuthEnv.GITHUB_CLIENT_SECRET,
      privateKey: installationAuthEnv.GITHUB_PRIVATE_KEY,
      installationId: installationAuthEnv.GITHUB_INSTALLATION_ID,
    };
  } else {
    const tokenAuthEnv: GitHubTokenAuthEnv = validate<GitHubTokenAuthEnv>(process.env, GitHubTokenAuthSchema, {
      message,
    });
    return {
      authType: "token",
      ...(tokenAuthEnv.GITHUB_BASE_URL && { apiEndpoint: tokenAuthEnv.GITHUB_BASE_URL }),
      authToken: tokenAuthEnv.GITHUB_TOKEN,
    };
  }
}
