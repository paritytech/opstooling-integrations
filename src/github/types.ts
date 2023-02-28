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

type GitHubConfigTokenAuthOpts = GitHubConfigBaseOpts & {
  authType: "token";
  authToken: string;
};

export type GitHubConfigOpts =
  | GitHubConfigAppAuthOpts
  | GitHubConfigInstallationPrivkeyAuthOpts
  | GitHubConfigTokenAuthOpts;

export type GitHubInstance = Octokit &
  (
    | {
        authType: "installation" | "token";
        token: string;
      }
    | {
        authType: "app";
      }
  );
