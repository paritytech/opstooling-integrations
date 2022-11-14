"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCommitStatus = exports.getPullRequest = void 0;
const utils_1 = require("../utils");
const setup_1 = require("./setup");
function makeMethod(scope, methodName) {
    return async (params, options) => {
        const instance = options?.octokitInstance ?? (await (0, setup_1.setupCommonInstance)((0, setup_1.getConfigOptsFromEnv)()));
        const logger = options?.logger ?? utils_1.defaultLogger;
        (0, setup_1.bindLogger)(instance, logger);
        /* Spent several hours trying to make this work, not sure if that's TS in general or typings of Octokit,
           but nothing except `any` worked here */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-call
        return instance[scope][methodName](params);
    };
}
exports.getPullRequest = makeMethod("pulls", "get");
exports.createCommitStatus = makeMethod("repos", "createCommitStatus");
//# sourceMappingURL=rest.js.map