"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRepoNameAndOwnerFromNodeId = void 0;
const setup_1 = require("./setup");
// Name pick is a bit wonky, although as comprehensive as possible
async function getRepoNameAndOwnerFromNodeId(node_id, options) {
    const query = `
      query($id: ID!) {
        node(id: $id) {
          ... on Repository {
            owner {
              login
            }
            name
          }
        }
      }`;
    const { octokit } = await (0, setup_1.resolveSetup)(options);
    const result = await octokit.graphql(query, { id: node_id });
    if (result.node === null || result.node.owner === null) {
        return null;
    }
    return { owner: result.node.owner.login, name: result.node.name };
}
exports.getRepoNameAndOwnerFromNodeId = getRepoNameAndOwnerFromNodeId;
//# sourceMappingURL=graphql.js.map