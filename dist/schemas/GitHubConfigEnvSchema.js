"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitHubTokenAuthSchema = exports.GitHubAppInstallationAuthSchema = exports.GitHubAppAuthSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const GitHubConfigEnvBaseSchema = joi_1.default.object({ GITHUB_BASE_URL: joi_1.default.string() });
exports.GitHubAppAuthSchema = GitHubConfigEnvBaseSchema.concat(joi_1.default.object({
    GITHUB_AUTH_TYPE: joi_1.default.string().allow("app").required(),
    GITHUB_APP_ID: joi_1.default.string().pattern(/\d+/).required(),
    GITHUB_PRIVATE_KEY: joi_1.default.string().required(),
})).meta({ className: "GitHubAppAuthEnv" });
exports.GitHubAppInstallationAuthSchema = GitHubConfigEnvBaseSchema.concat(joi_1.default.object({
    GITHUB_AUTH_TYPE: joi_1.default.string().allow(joi_1.default.override, "installation").required(),
    GITHUB_APP_ID: joi_1.default.string().pattern(/\d+/).required(),
    GITHUB_PRIVATE_KEY: joi_1.default.string().required(),
    GITHUB_INSTALLATION_ID: joi_1.default.string().required(),
})).meta({ className: "GitHubAppInstallationAuthEnv" });
exports.GitHubTokenAuthSchema = GitHubConfigEnvBaseSchema.concat(joi_1.default.object({ GITHUB_AUTH_TYPE: joi_1.default.string().allow("token"), GITHUB_TOKEN: joi_1.default.string().required() })).meta({ className: "GitHubTokenAuthEnv" });
//# sourceMappingURL=GitHubConfigEnvSchema.js.map