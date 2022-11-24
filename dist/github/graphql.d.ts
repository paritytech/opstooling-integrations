import { GitHubOptions } from "./types";
export declare function getRepoNameAndOwnerFromNodeId(node_id: string, options?: GitHubOptions): Promise<{
    owner: string;
    name: string;
} | null>;
