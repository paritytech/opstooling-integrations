"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCommitStatus = exports.getTags = exports.getTag = exports.getRepository = exports.getPullRequests = exports.getPullRequest = exports.getBranch = exports.getBranches = exports.getAppInstallations = void 0;
const plugin_paginate_rest_1 = require("@octokit/plugin-paginate-rest");
const setup_1 = require("./setup");
function makeMethod(scope, methodName) {
    return async (params, options) => {
        const { octokit } = await (0, setup_1.resolveSetup)(options);
        /* Spent several hours trying to make this work, not sure if that's TS in general or typings of Octokit,
           but nothing except `any` worked here */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-call
        return octokit[scope][methodName](params);
    };
}
function makePaginateMethod(route) {
    return async (params, options) => {
        const { octokit } = await (0, setup_1.resolveSetup)(options);
        return await (0, plugin_paginate_rest_1.composePaginateRest)(octokit, route, { ...params, per_page: 100 });
    };
}
exports.getAppInstallations = makePaginateMethod("GET /app/installations");
exports.getBranches = makePaginateMethod("GET /repos/{owner}/{repo}/branches");
exports.getBranch = makeMethod("repos", "getBranch");
exports.getPullRequest = makeMethod("pulls", "get");
exports.getPullRequests = makePaginateMethod("GET /repos/{owner}/{repo}/pulls");
exports.getRepository = makeMethod("repos", "get");
exports.getTag = makeMethod("git", "getTag");
exports.getTags = makePaginateMethod("GET /repos/{owner}/{repo}/tags");
exports.createCommitStatus = makeMethod("repos", "createCommitStatus");
//# sourceMappingURL=rest.js.map