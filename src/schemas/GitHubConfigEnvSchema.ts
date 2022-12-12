import Joi from "joi";

const GitHubConfigEnvBaseSchema = Joi.object({ GITHUB_BASE_URL: Joi.string() });

export const GitHubAppAuthSchema = GitHubConfigEnvBaseSchema.concat(
  Joi.object({
    GITHUB_AUTH_TYPE: Joi.string().allow("app").required(),
    GITHUB_APP_ID: Joi.string().pattern(/\d+/).required(),
    GITHUB_PRIVATE_KEY: Joi.string().required(),
  }),
).meta({ className: "GitHubAppAuthEnv" });

export const GitHubAppInstallationAuthSchema = GitHubConfigEnvBaseSchema.concat(
  Joi.object({
    GITHUB_AUTH_TYPE: Joi.string().allow(Joi.override, "installation").required(),
    GITHUB_APP_ID: Joi.string().pattern(/\d+/).required(),
    GITHUB_PRIVATE_KEY: Joi.string().required(),
    GITHUB_INSTALLATION_ID: Joi.string().required(),
  }),
).meta({ className: "GitHubAppInstallationAuthEnv" });

export const GitHubAppOAuthSchema = GitHubConfigEnvBaseSchema.concat(
  Joi.object({
    GITHUB_AUTH_TYPE: Joi.string().allow(Joi.override, "oauth").required(),
    GITHUB_CLIENT_ID: Joi.string().required(),
    GITHUB_CLIENT_SECRET: Joi.string().required(),
  }),
).meta({ className: "GitHubAppOAuthEnv" });

export const GitHubTokenAuthSchema = GitHubConfigEnvBaseSchema.concat(
  Joi.object({ GITHUB_AUTH_TYPE: Joi.string().allow("token"), GITHUB_TOKEN: Joi.string().required() }),
).meta({ className: "GitHubTokenAuthEnv" });
