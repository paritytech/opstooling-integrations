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
    clientId: string;
    clientSecret: string;
    privateKey: string;
};
declare type GitHubConfigInstallationAuthOpts = Omit<GitHubConfigAppAuthOpts, "authType"> & {
    authType: "installation";
    installationId: string;
};
declare type GitHubConfigTokenAuthOpts = GitHubConfigBaseOpts & {
    authType: "token";
    authToken: string;
};
export declare type GitHubConfigOpts = GitHubConfigAppAuthOpts | GitHubConfigInstallationAuthOpts | GitHubConfigTokenAuthOpts;
export declare type GitHubInstance = Octokit & {
    token: string;
};
export {};
