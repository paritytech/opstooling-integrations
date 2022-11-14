import { Octokit } from "@octokit/rest";
import { Logger } from "opstooling-js";
import { GitHubConfigOpts } from "../github";
export declare function getInstance(opts: GitHubConfigOpts): Promise<Octokit>;
export declare function bindLogger(octokit: Octokit, logger: Logger): void;
export declare const setupCommonInstance: (opts: GitHubConfigOpts) => Promise<Octokit>;
export declare function getConfigOptsFromEnv(): GitHubConfigOpts;
