import { Octokit } from "@octokit/rest";
import { BaseOptions } from "../types";
export declare type GitHubOptions = BaseOptions & {
    octokitInstance?: GitHubInstance;
};
declare type GitHubConfigBaseOpts = {
    apiEndpoint?: string;
};
declare type GitHubConfigAppAuthOpts = GitHubConfigBaseOpts & {
    authType: "app";
    appId: string;
    privateKey: string;
};
declare type GitHubConfigInstallationPrivkeyAuthOpts = GitHubConfigBaseOpts & {
    authType: "installation";
    appId: string;
    privateKey: string;
    installationId: string;
};
declare type GitHubConfigTokenAuthOpts = GitHubConfigBaseOpts & {
    authType: "token";
    authToken: string;
};
export declare type GitHubConfigOpts = GitHubConfigAppAuthOpts | GitHubConfigInstallationPrivkeyAuthOpts | GitHubConfigTokenAuthOpts;
export declare type GitHubInstance = Octokit & ({
    authType: "installation" | "token";
    token: string;
} | {
    authType: "app";
});
export {};
