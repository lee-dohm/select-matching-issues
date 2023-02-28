/**
 * Valid output formats for the list of matching issues.
 */
// eslint-disable-next-line no-shadow
export enum OutputFormat {
  /** Outputs an unordered list of Markdown links */
  LIST = 'list',

  /** Outputs a raw list of URLs, one per line */
  RAW = 'raw',

  /** Outputs a NDJSON data **/
  NDJSON = 'ndjson'
}
