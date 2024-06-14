import { resolveSetup } from "#src/github/setup";
import { GitHubOptions } from "#src/github/types";

// Name pick is a bit wonky, although as comprehensive as possible
export async function getRepoNameAndOwnerFromNodeId(
  node_id: string,
  options?: GitHubOptions,
): Promise<{ owner: string; name: string } | null> {
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
  const { octokit } = await resolveSetup(options);

  type Response = { node: { owner: { login: string } | null; name: string } | null };
  const result = await octokit.graphql<Response>(query, { id: node_id });

  if (result.node === null || result.node.owner === null) {
    return null;
  }

  return { owner: result.node.owner.login, name: result.node.name };
}
