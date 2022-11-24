import { composePaginateRest, PaginatingEndpoints } from "@octokit/plugin-paginate-rest";
import { type Octokit as TOctokit, RestEndpointMethodTypes } from "@octokit/rest";

import { resolveSetup } from "./setup";
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
    const { octokit } = await resolveSetup(options);

    /* Spent several hours trying to make this work, not sure if that's TS in general or typings of Octokit,
       but nothing except `any` worked here */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-call
    return (octokit[scope][methodName] as any)(params);
  };
}

type DataType<T> = "data" extends keyof T ? T["data"] : unknown;

function makePaginateMethod<R extends keyof PaginatingEndpoints>(route: R) {
  return async (
    params: PaginatingEndpoints[R]["parameters"],
    options?: GitHubOptions,
  ): Promise<DataType<PaginatingEndpoints[R]["response"]>> => {
    const { octokit } = await resolveSetup(options);
    return await composePaginateRest(octokit, route, { ...params, per_page: 100 });
  };
}

export const getAppInstallations = makePaginateMethod("GET /app/installations");
export const getBranches = makePaginateMethod("GET /repos/{owner}/{repo}/branches");
export const getBranch = makeMethod("repos", "getBranch");
export const getPullRequest = makeMethod("pulls", "get");
export const getPullRequests = makePaginateMethod("GET /repos/{owner}/{repo}/pulls");
export const getRepository = makeMethod("repos", "get");
export const getTag = makeMethod("git", "getTag");
export const getTags = makePaginateMethod("GET /repos/{owner}/{repo}/tags");
export const createCommitStatus = makeMethod("repos", "createCommitStatus");
