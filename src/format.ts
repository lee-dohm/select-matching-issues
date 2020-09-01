import { Issue } from './github'

/**
 * Formats the issues into a Markdown unordered list of Issue links, one per line.
 *
 * The Issue's title is used as the link text and the Issue's URL is used as the link target.
 *
 * @param issues List of issues to format
 */
export function list(issues: Issue[]): string {
  return issues.map((issue) => `- [${issue.title}](${issue.url})`).join('\n')
}

/**
 * Formats the issues into a raw list of Issue URLs, one per line of text.
 *
 * @param issues List of issues to format
 */
export function raw(issues: Issue[]): string {
  return issues.map((issue) => issue.url).join('\n')
}
