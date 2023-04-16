import { stat, access, constants } from 'node:fs/promises'
import inquirer, { QuestionCollection } from 'inquirer'
import path from 'node:path'
import ora from 'ora'

import { clearConsole, closeProgram, printMessage, validateFilePath } from '../../utils.js'

import { TestGenerationStrategy } from './test-generation.strategy.js'

import { confirmationPrompt } from '../shared.js'
import { initPrompt } from '../index.js'

const MESSAGE_FEEDBACK = 'Your tests are being generated, please wait a moment...'

const MESSAGE_SUCCEEDED = 'Your test was created successfully.'

const questions: QuestionCollection = [
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
    }
  },
  {
    type: 'input',
    name: 'outputPath',
    message: 'Specify the output file path:',
    validate: (value: string) => validateFilePath(value) || 'The path is invalid.'
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
    }
  },
  {
    type: 'editor',
    name: 'description',
    message: 'Describe the tests you need?'
  }
]

export async function testGenerationPrompt (): Promise<void> {
  const answers = await inquirer.prompt(questions)

  const { inputPath, outputPath, description, writeMode } = answers

  const spinner = ora(MESSAGE_FEEDBACK).start()

  try {
    const strategy = new TestGenerationStrategy()

    await strategy.execute({
      inputPath,
      outputPath,
      description,
      writeMode
    })

    spinner.succeed(MESSAGE_SUCCEEDED)

    const isContinue = await confirmationPrompt()

    if (!isContinue) {
      printMessage({
        message: 'Spector is here to help you.',
        startEmoji: 'ghost',
        endEmoji: 'white_heart'
      })

      return closeProgram()
    }

    clearConsole()

    initPrompt()
  } catch (error: any) {
    const errorMessage = error?.response?.data?.error?.message || error?.message || 'An error occurred during the operation.'

    spinner.fail(errorMessage)

    closeProgram()
  }
}
