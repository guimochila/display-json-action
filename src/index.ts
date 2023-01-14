import fs from 'fs'
import * as core from '@actions/core'
import path from 'path'
import Handlebars from 'handlebars'
import { Octokit } from '@octokit/core'
import { restEndpointMethods } from '@octokit/plugin-rest-endpoint-methods'

function htmlTemplate(): string {
  return `
    <h1>{{ title }}</h1>
    <br />
  `
}

function readJSONFile(filePath: string): string | undefined {
  try {
    const content = fs.readFileSync(path.join('.', filePath), {
      encoding: 'utf-8',
      flag: 'r',
    })

    return content
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
  }
}

async function run(): Promise<void> {
  try {
    const owner = core.getInput('owner', { required: true })
    const repo = core.getInput('repo', { required: true })
    const pr_number = core.getInput('pr_number', { required: true })
    const token = core.getInput('token', { required: true })
    const file = core.getInput('file', { required: true })

    const MyOctoKit = Octokit.plugin(restEndpointMethods)
    const octokit = new MyOctoKit({ auth: token })

    const fileContent = readJSONFile(file)
    const template = Handlebars.compile(htmlTemplate())

    if (!fileContent) {
      throw new Error('Error reading file')
    }

    await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: parseInt(pr_number),
      body: template(JSON.parse(fileContent)),
    })
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
  }
}

run()
