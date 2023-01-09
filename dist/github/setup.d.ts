import { Octokit } from "@octokit/rest";
import { Logger } from "opstooling-js";
import { GitHubConfigOpts } from "../github";
import { GitHubInstance, GitHubOptions } from "./types";
export declare function getInstance(opts: GitHubConfigOpts): Promise<GitHubInstance>;
export declare type Setup = {
    octokit: GitHubInstance;
    logger: Logger;
};
export declare function resolveSetup(options?: GitHubOptions): Promise<Setup>;
export declare function bindLogger(octokit: Octokit, logger: Logger): void;
export declare const setupCommonInstance: (opts: GitHubConfigOpts) => Promise<GitHubInstance>;
export declare function getConfigOptsFromEnv(): GitHubConfigOpts;
export declare function getFetchEndpoint(options?: GitHubOptions): Promise<{
    token: string;
    url: string;
}>;
