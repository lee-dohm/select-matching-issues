import * as core from '@actions/core'
import * as fs from 'fs'
import * as util from 'util'

import * as github from './github'

const writeFile = util.promisify(fs.writeFile)

async function run(): Promise<void> {
  try {
    const path = core.getInput('path') ?? '__matching-issues.txt'
    const searchQuery = core.getInput('query', { required: true })
    const token = core.getInput('token', { required: true })

    const urls = await github.getIssueUrls(token, searchQuery)

    await writeFile(path, urls.join('\n'))

    core.setOutput('path', path)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
