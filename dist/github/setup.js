"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFetchEndpoint = exports.setupCommonInstance = exports.bindLogger = exports.resolveSetup = exports.getInstance = void 0;
const auth_app_1 = require("@octokit/auth-app");
const rest_1 = require("@octokit/rest");
const opstooling_js_1 = require("opstooling-js");
const GitHubConfigEnvSchema_1 = require("../schemas/GitHubConfigEnvSchema");
const utils_1 = require("../utils");
async function getInstance(opts) {
    let authStrategy;
    let auth;
    switch (opts.authType) {
        case "app":
            authStrategy = auth_app_1.createAppAuth;
            auth = { appId: opts.appId, privateKey: opts.privateKey, type: "app" };
            break;
        case "installation":
            authStrategy = auth_app_1.createAppAuth;
            auth = {
                appId: opts.appId,
                installationId: opts.installationId,
                privateKey: opts.privateKey,
                type: "installation",
            };
            break;
        case "token":
            auth = opts.authToken;
    }
    const throttle = {
        // Options are typed as `any` in octokit/plugin-throttling
        /* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/restrict-template-expressions */
        onRateLimit: (retryAfter, options, octokit, retryCount) => {
            octokit.log.warn(`Request quota exhausted for request ${options.method} ${options.url}`);
            if (retryCount < 3) {
                octokit.log.info(`Retrying after ${retryAfter} seconds!`);
                return true;
            }
        },
        onSecondaryRateLimit: (retryAfter, options, octokit, retryCount) => {
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
    const octokitInstance = new rest_1.Octokit({
        authStrategy,
        auth,
        baseUrl: opts.apiEndpoint ?? "https://api.github.com",
        throttle,
    });
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */
    if (opts.authType === "app") {
        return { ...octokitInstance, authType: "app" };
    }
    const { token } = (await octokitInstance.auth(auth));
    return { ...octokitInstance, authType: opts.authType, token };
}
exports.getInstance = getInstance;
async function resolveSetup(options) {
    const octokit = options?.octokitInstance ?? (await (0, exports.setupCommonInstance)(getConfigOptsFromEnv()));
    const logger = options?.logger ?? utils_1.defaultLogger;
    bindLogger(octokit, logger);
    return { octokit, logger };
}
exports.resolveSetup = resolveSetup;
function bindLogger(octokit, logger) {
    octokit.log = Object.assign(octokit.log, {
        debug: logger.log.bind(logger, "debug"),
        info: logger.info.bind(logger),
        warn: logger.warn.bind(logger),
        error: logger.error.bind(logger),
    });
}
exports.bindLogger = bindLogger;
exports.setupCommonInstance = (0, utils_1.lazyApi)(getInstance);
function getConfigOptsFromEnv() {
    const message = "Invalid environment for GitHub integration. Consult README.md";
    if (process.env.GITHUB_PRIVATE_KEY_BASE64 && !process.env.GITHUB_PRIVATE_KEY) {
        process.env.GITHUB_PRIVATE_KEY = Buffer.from(process.env.GITHUB_PRIVATE_KEY_BASE64, "base64").toString();
    }
    if (process.env.GITHUB_AUTH_TYPE === "app") {
        const appAuthEnv = (0, opstooling_js_1.validate)(process.env, GitHubConfigEnvSchema_1.GitHubAppAuthSchema, { message });
        return {
            authType: "app",
            ...(appAuthEnv.GITHUB_BASE_URL && { apiEndpoint: appAuthEnv.GITHUB_BASE_URL }),
            appId: appAuthEnv.GITHUB_APP_ID,
            privateKey: appAuthEnv.GITHUB_PRIVATE_KEY,
        };
    }
    else if (process.env.GITHUB_AUTH_TYPE === "installation") {
        const installationAuthEnv = (0, opstooling_js_1.validate)(process.env, GitHubConfigEnvSchema_1.GitHubAppInstallationAuthSchema, {
            message,
        });
        return {
            authType: "installation",
            ...(installationAuthEnv.GITHUB_BASE_URL && { apiEndpoint: installationAuthEnv.GITHUB_BASE_URL }),
            appId: installationAuthEnv.GITHUB_APP_ID,
            privateKey: installationAuthEnv.GITHUB_PRIVATE_KEY,
            installationId: installationAuthEnv.GITHUB_INSTALLATION_ID,
        };
    }
    else {
        const tokenAuthEnv = (0, opstooling_js_1.validate)(process.env, GitHubConfigEnvSchema_1.GitHubTokenAuthSchema, { message });
        return {
            authType: "token",
            ...(tokenAuthEnv.GITHUB_BASE_URL && { apiEndpoint: tokenAuthEnv.GITHUB_BASE_URL }),
            authToken: tokenAuthEnv.GITHUB_TOKEN,
        };
    }
}
async function getFetchEndpoint(options) {
    const setup = await resolveSetup(options);
    if (setup.octokit.authType !== "token" && setup.octokit.authType !== "installation") {
        throw new Error(`getFetchEndpoint can only be used with "installation" or "token" authType. Got "${setup.octokit.authType}" instead`);
    }
    const token = setup.octokit.token;
    return { url: `https://x-access-token:${setup.octokit.token}@github.com`, token };
}
exports.getFetchEndpoint = getFetchEndpoint;
//# sourceMappingURL=setup.js.map