import fs from 'fs'
import * as core from '@actions/core'
import path from 'path'
import Handlebars from 'handlebars'

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
    const file = core.getInput('file')
    const fileContent = readJSONFile(file)
    const template = Handlebars.compile(htmlTemplate())

    if (!fileContent) {
      throw new Error('Error reading file')
    }

    console.log(template(JSON.parse(fileContent)))
    console.log(JSON.parse(fileContent))
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
  }
}

run()
