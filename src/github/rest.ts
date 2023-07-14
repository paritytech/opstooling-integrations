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
  ): Promise<DataType<ExtractResponse<RestEndpointMethodTypes[S][M]>>> => {
    const { octokit } = await resolveSetup(options);

    /* Spent several hours trying to make this work, not sure if that's TS in general or typings of Octokit,
       but nothing except `any` worked here */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-call
    return (await (octokit[scope][methodName] as any)(params)).data;
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
export const getRepoInstallation = makeMethod("apps", "getRepoInstallation");
export const getBranches = makePaginateMethod("GET /repos/{owner}/{repo}/branches");
export const getBranch = makeMethod("repos", "getBranch");
export const getPullRequest = makeMethod("pulls", "get");
export const getPullRequests = makePaginateMethod("GET /repos/{owner}/{repo}/pulls");
export const getRepository = makeMethod("repos", "get");
export const getTag = makeMethod("git", "getTag");
export const listMatchingRefs = makeMethod("git", "listMatchingRefs");
export const getTags = makePaginateMethod("GET /repos/{owner}/{repo}/tags");
export const createCommitStatus = makeMethod("repos", "createCommitStatus");
export const createComment = makeMethod("issues", "createComment");
export const createReactionForIssue = makeMethod("reactions", "createForIssue");
export const createReactionForIssueComment = makeMethod("reactions", "createForIssueComment");

export async function isGithubOrganizationMember(
  params: { org: string; username: string },
  options?: GitHubOptions,
): Promise<boolean> {
  const { octokit } = await resolveSetup(options);
  try {
    const res = await octokit.orgs.checkMembershipForUser(params);
    // Somehow, TS thinks that res.status can be only 302, but in reality, it can be anything
    return (res.status as number) === 204;
  } catch (e) {
    if (e.status === 404) {
      return false;
    }
    throw e;
  }
}

export async function isGithubTeamMember(
  params: { org: string; team: string; username: string },
  options?: GitHubOptions,
): Promise<boolean> {
  const { octokit } = await resolveSetup(options);
  try {
    const res = await octokit.teams.getMembershipForUserInOrg({
      org: params.org,
      username: params.username,
      team_slug: params.team,
    });
    return res.data.state === "active";
  } catch (e) {
    if (e.status === 404) {
      return false;
    }
    throw e;
  }
}
