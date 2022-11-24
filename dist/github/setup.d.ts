import { Octokit } from "@octokit/rest";
import { Logger } from "opstooling-js";
import { GitHubConfigOpts } from "../github";
import { GitHubOptions } from "./types";
export declare function getInstance(opts: GitHubConfigOpts): Promise<Octokit>;
export declare type Setup = {
    octokit: Octokit;
    logger: Logger;
};
export declare function resolveSetup(options?: GitHubOptions): Promise<Setup>;
export declare function bindLogger(octokit: Octokit, logger: Logger): void;
export declare const setupCommonInstance: (opts: GitHubConfigOpts) => Promise<Octokit>;
export declare function getConfigOptsFromEnv(): GitHubConfigOpts;
