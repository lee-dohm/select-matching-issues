import { Issue } from './github'
import { OutputFormat } from './output-format'

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

/**
 * Formats the issues into a NDJSON format, each line is a JSON object.
 *
 * @param issues List of issues to format
 */
 export function ndjson(issues: Issue[]): string {
  return issues.map((issue) => JSON.stringify(issue)).join('\n')
 }

/**
 * Writes the list of issues to a string in the requested format.
 *
 * @param issues List of issues to format
 * @param format Format to use when writing the list of issues
 */
export function write(issues: Issue[], format: OutputFormat): string {
  switch (format) {
    case OutputFormat.LIST:
      return list(issues)

    case OutputFormat.RAW:
      return raw(issues)

    case OutputFormat.NDJSON:
      return ndjson(issues)

    default:
      throw new Error(`Invalid output format: ${format}`)
  }
}
