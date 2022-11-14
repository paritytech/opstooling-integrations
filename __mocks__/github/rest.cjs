const { jest } = require("@jest/globals");

exports.getPullRequest = jest.fn(async () => Promise.reject({ status: 404, message: "Not found" }));
exports.createCommitStatus = jest.fn(({ target_url, state, context }) => {
  const id = Math.floor(Math.random() * 1000);
  return Promise.resolve({ status: 201, data: { url: `https://example.com/${id}`, state, target_url, context, id } });
});
