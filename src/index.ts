#!/usr/bin/env node

import { access, stat, constants } from 'node:fs/promises'
import inquirer, { QuestionCollection } from 'inquirer'
import path from 'node:path'

import { commands } from './declarations.js'
import { strategies } from './strategies.js'
import { validateFilePath } from './utils.js'

const questions: QuestionCollection = [
  {
    type: 'list',
    name: 'command',
    message: 'Select the command you want to run?',
    choices: [
      {
        name: 'Generation testing',
        value: commands.GenerationTesting
      },
      {
        name: 'Generation documentation',
        value: commands.GenerationDocumentation
      },
      {
        name: 'Bug detection',
        value: commands.BugDetection
      },
      {
        name: 'Explained code',
        value: commands.ExplainedCode
      },
      {
        name: 'Generation functions',
        value: commands.GenerationFuntions
      }
    ]
  },
  {
    type: 'input',
    name: 'inputPath',
    message: 'Enter the file path:',
    async validate(value) {
      try {
        const statResource = await stat(path.resolve(value))

        if (statResource.isDirectory()) return 'The path entered must be a file, not a directory.'

        await access(path.resolve(value), constants.R_OK)
        return true
      } catch (error: any) {
        return error?.message ?? 'An error occurred in the operation.'
      }
    },
  },
  {
    type: 'input',
    name: 'outputPath',
    message: 'Specify the output file path:',
    validate: (value: string) => {
      return validateFilePath(value) || 'The path is invalid.'
    }
  },
  {
    type: 'list',
    name: 'writeMode',
    message: 'Select writing mode:',
    choices: [
      {
        name: 'Append',
        value: 'append'
      },
      {
        name: 'Overwrite',
        value: 'overwrite'
      }
    ],
    default: 'overwrite',
    validate: async (_, answers) => {
      const { outputPath } = answers || {}

      try {
        await access(outputPath, constants.W_OK)
      } catch (error: any) {
        return error?.message ||  'An error occurred in the operation.'
      }
    },
    when: async ({ outputPath }) => {
      try {
        await access(outputPath, constants.R_OK)
        return true
      } catch (error) {
        return false
      }
    },
  },
  {
    type: 'editor',
    name: 'description',
    message: 'Describe the tests you need?'
  }
];

(async () => {
  const data = await inquirer.prompt(questions)

  const { command, inputPath, outputPath, description, writeMode } = data

  const strategy = strategies[command]

  try {
    await strategy({
      command,
      inputPath,
      outputPath,
      description,
      writeMode
    })

    // console.log(completions.data)
  } catch (error: any) {
    if (error.response) {
      console.log(error.response.status)
      console.log(error.response.data)
    } else {
      console.log(error.message)
    }
  }
})()
