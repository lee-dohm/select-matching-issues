import * as core from '@actions/core'
import * as fs from 'fs'
import * as util from 'util'

import * as format from './format'
import * as github from './github'

const writeFile = util.promisify(fs.writeFile)

/**
 * Performs the work of the Action.
 */
async function run(): Promise<void> {
  try {
    const outputFormat = core.getInput('format') ?? 'raw'
    const path = core.getInput('path') ?? '__matching-issues.txt'
    const searchQuery = core.getInput('query', { required: true })
    const token = core.getInput('token', { required: true })

    const issues = await github.getMatchingIssues(token, searchQuery)
    let text

    if (outputFormat === 'list') {
      text = format.list(issues)
    } else {
      text = format.raw(issues)
    }

    await writeFile(path, text)

    core.debug('----- Output -----')
    core.debug(text)
    core.debug('------------------')

    core.setOutput('path', path)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
