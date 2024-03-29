const { jest } = require("@jest/globals");

exports.getAppInstallations = jest.fn(async () => Promise.resolve([]));
exports.getBranches = jest.fn(async () => Promise.resolve([]));
exports.getBranch = jest.fn(async () => Promise.reject({ status: 404, message: "Not found" }));
exports.getPullRequest = jest.fn(async () => Promise.reject({ status: 404, message: "Not found" }));
exports.getPullRequests = jest.fn(async () => Promise.resolve([]));
exports.listMatchingRefs = jest.fn(async () => Promise.resolve([]));
exports.getReposotory = jest.fn(async () => Promise.reject({ status: 404, message: "Not found" }));
exports.getTag = jest.fn(async () => Promise.reject({ status: 404, message: "Not found" }));
exports.getTags = jest.fn(async () => Promise.resolve([]));
exports.createCommitStatus = jest.fn(({ target_url, state, context }) => {
  const id = Math.floor(Math.random() * 1000);
  return Promise.resolve({ status: 201, data: { url: `https://example.com/${id}`, state, target_url, context, id } });
});
exports.createComment = jest.fn(({ owner, repo, issue_number, body }) => {
  const id = Math.floor(Math.random() * 1000);
  return Promise.resolve({
    status: 201,
    data: { url: `https://example.com/repos/${owner}/${repo}/issues/${issue_number}/comments/${id}`, body, id },
  });
});
exports.getRepoInstallation = jest.fn(async () => Promise.reject({ status: 404, message: "Not found" }));

exports.isGithubOrganizationMember = jest.fn(async () => Promise.resolve(false));
exports.isGithubTeamMember = jest.fn(async () => Promise.resolve(false));

exports.getFileContent = jest.fn(async ({ owner, repo, path }) =>
  Promise.reject(new Error(`File ${owner}/${repo}/${path} doesn't exist`)),
);
