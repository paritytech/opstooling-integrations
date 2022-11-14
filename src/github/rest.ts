import { type Octokit as TOctokit, RestEndpointMethodTypes } from "@octokit/rest";

import { defaultLogger } from "src/utils";

import { bindLogger, getConfigOptsFromEnv, setupCommonInstance } from "./setup";
import { GitHubOptions } from "./types";

type ExtractParameters<T> = "parameters" extends keyof T ? T["parameters"] : never;
type ExtractResponse<T> = "response" extends keyof T ? T["response"] : never;

type RestApis = TOctokit;
type Scopes = keyof RestEndpointMethodTypes & keyof RestApis;
type MethodName<S extends Scopes> = keyof RestEndpointMethodTypes[S] & keyof RestApis[S];

function makeMethod<S extends Scopes, M extends MethodName<S>>(scope: S, methodName: M) {
  return async (
    params: ExtractParameters<RestEndpointMethodTypes[S][M]>,
    options?: GitHubOptions,
  ): Promise<ExtractResponse<RestEndpointMethodTypes[S][M]>> => {
    const instance: TOctokit = options?.octokitInstance ?? (await setupCommonInstance(getConfigOptsFromEnv()));
    const logger = options?.logger ?? defaultLogger;

    bindLogger(instance, logger);

    /* Spent several hours trying to make this work, not sure if that's TS in general or typings of Octokit,
       but nothing except `any` worked here */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-call
    return (instance[scope][methodName] as any)(params);
  };
}

type Params<S extends Scopes, M extends MethodName<S>> = ExtractParameters<RestEndpointMethodTypes[S][M]>;
type Response<S extends Scopes, M extends MethodName<S>> = ExtractResponse<RestEndpointMethodTypes[S][M]>;

type GitHubMethod<S extends Scopes, M extends MethodName<S>> = (
  params: Params<S, M>,
  options?: GitHubOptions,
) => Promise<Response<S, M>>;

export const getPullRequest: GitHubMethod<"pulls", "get"> = makeMethod("pulls", "get");
export const createCommitStatus: GitHubMethod<"repos", "createCommitStatus"> = makeMethod(
  "repos",
  "createCommitStatus",
);
