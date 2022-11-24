import { createCommitStatus } from "../rest";
declare type CommitStatusSuccess = Awaited<ReturnType<typeof createCommitStatus>>;
export declare function createCommitStatusSuccessfulResponse(): CommitStatusSuccess;
export {};
