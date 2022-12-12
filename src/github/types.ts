import { Octokit } from "@octokit/rest";

import { BaseOptions } from "src/types";

export type GitHubOptions = BaseOptions & {
  octokitInstance?: GitHubInstance;
};

type GitHubConfigBaseOpts = {
  apiEndpoint?: string;
};

type GitHubConfigAppAuthOpts = GitHubConfigBaseOpts & {
  authType: "app";
  appId: string;
  privateKey: string;
};

type GitHubConfigInstallationPrivkeyAuthOpts = GitHubConfigBaseOpts & {
  authType: "installation";
  appId: string;
  privateKey: string;
  installationId: string;
};

type GitHubConfigInstallationOAuthOpts = GitHubConfigBaseOpts & {
  authType: "oauth";
  clientId: string;
  clientSecret: string;
};

type GitHubConfigTokenAuthOpts = GitHubConfigBaseOpts & {
  authType: "token";
  authToken: string;
};

export type GitHubConfigOpts =
  | GitHubConfigAppAuthOpts
  | GitHubConfigInstallationPrivkeyAuthOpts
  | GitHubConfigInstallationOAuthOpts
  | GitHubConfigTokenAuthOpts;

export type GitHubInstance = Octokit & { token: string };
