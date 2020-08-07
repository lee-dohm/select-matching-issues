import * as core from '@actions/core'
import * as github from '@actions/github'

import { GitHub } from '@actions/github/lib/utils'

/**
 * An object containing an issue URL.
 */
interface IssueUrl {
  url: string
}

/**
 * An object containing a repository name and owner.
 */
interface NameWithOwner {
  owner: string
  repo: string
}

export type GitHubClient = InstanceType<typeof GitHub>
export type GraphQlQueryResponseData = { [key: string]: any } | null

/**
 * GraphQL query template to use to execute the search.
 */
const query = `
query($searchQuery: String!) {
  search(first: 100, query: $searchQuery, type: ISSUE) {
    nodes {
      ... on Issue {
        url
      }
    }
  }
}
`

/**
 * Formats the repo name and owner into the standard string notation.
 *
 * @param nameWithOwner Repo owner and name information
 */
export function formatNameWithOwner({ owner, repo }: NameWithOwner): string {
  return `${owner}/${repo}`
}

/**
 * Gets the list of issue URLs that match the query.
 *
 * Takes the `searchQuery`, includes a specifier to restrict the query to the current repo,
 * and inserts it into the GraphQL search query template.
 *
 * @param token Token to use to execute the search
 * @param searchQuery Search query to execute
 */
export async function getIssueUrls(token: string, searchQuery: string): Promise<string[]> {
  const client = github.getOctokit(token)
  const context = github.context
  const queryText = `repo:${formatNameWithOwner(context.repo)} ${searchQuery}`

  core.debug(`Query: ${queryText}`)

  const results: GraphQlQueryResponseData = await client.graphql(query, { searchQuery: queryText })

  core.debug(`Results: ${JSON.stringify(results, null, 2)}`)

  if (results) {
    return results.search.nodes.map((issue: IssueUrl) => issue.url)
  } else {
    return []
  }
}
