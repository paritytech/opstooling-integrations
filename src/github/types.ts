import { Octokit } from "@octokit/rest";

import { BaseOptions } from "src/types";

export type GitHubOptions = BaseOptions & {
  octokitInstance?: Octokit;
};

type GitHubConfigBaseOpts = {
  apiEndpoint?: string;
};

type GitHubConfigAppAuthOpts = GitHubConfigBaseOpts & {
  authType: "app";
  appId: string;
  clientId: string;
  clientSecret: string;
  privateKey: string;
};

type GitHubConfigInstallationAuthOpts = Omit<GitHubConfigAppAuthOpts, "authType"> & {
  authType: "installation";
  installationId: string;
};

type GitHubConfigTokenAuthOpts = GitHubConfigBaseOpts & {
  authType: "token";
  authToken: string;
};

export type GitHubConfigOpts = GitHubConfigAppAuthOpts | GitHubConfigInstallationAuthOpts | GitHubConfigTokenAuthOpts;
