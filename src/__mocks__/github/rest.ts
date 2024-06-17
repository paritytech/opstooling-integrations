import { jest } from "@jest/globals";

exports.getAppInstallations = jest.fn(async () => await Promise.resolve([]));
exports.getBranches = jest.fn(async () => await Promise.resolve([]));
exports.getBranch = jest.fn(async () => await Promise.reject({ status: 404, message: "Not found" }));
exports.getPullRequest = jest.fn(async () => await Promise.reject({ status: 404, message: "Not found" }));
exports.getPullRequests = jest.fn(async () => await Promise.resolve([]));
exports.listMatchingRefs = jest.fn(async () => await Promise.resolve([]));
exports.getReposotory = jest.fn(async () => await Promise.reject({ status: 404, message: "Not found" }));
exports.getTag = jest.fn(async () => await Promise.reject({ status: 404, message: "Not found" }));
exports.getTags = jest.fn(async () => await Promise.resolve([]));
exports.createCommitStatus = jest.fn(
  ({ target_url, state, context }: { target_url: string; state: string; context: string }) => {
    const id = Math.floor(Math.random() * 1000);
    return Promise.resolve({ status: 201, data: { url: `https://example.com/${id}`, state, target_url, context, id } });
  },
);
exports.createComment = jest.fn(
  ({ owner, repo, issue_number, body }: { owner: string; repo: string; issue_number: string; body: string }) => {
    const id = Math.floor(Math.random() * 1000);
    return Promise.resolve({
      status: 201,
      data: { url: `https://example.com/repos/${owner}/${repo}/issues/${issue_number}/comments/${id}`, body, id },
    });
  },
);
exports.getRepoInstallation = jest.fn(async () => await Promise.reject({ status: 404, message: "Not found" }));

exports.isGithubOrganizationMember = jest.fn(async () => await Promise.resolve(false));
exports.isGithubTeamMember = jest.fn(async () => await Promise.resolve(false));

exports.getFileContent = jest.fn(
  async ({ owner, repo, path }: { owner: string; repo: string; path: string }) =>
    await Promise.reject(new Error(`File ${owner}/${repo}/${path} doesn't exist`)),
);
