import inquirer, { QuestionCollection } from 'inquirer'
import _path from 'node:path'
import ora from 'ora'

import { clearConsole, closeProgram, printMessage, validateFilePath } from '../../utils.js'

import { TestGenerationStrategy } from './test-generation.strategy.js'

import { confirmationPrompt } from '../shared.js'
import { initPrompt } from '../index.js'

import { FileService } from '../../services/file.service.js'

const MESSAGE_FEEDBACK = 'Your tests are being generated, please wait a moment...'

const MESSAGE_SUCCEEDED = 'Your test was created successfully.'

const fileService = new FileService()

const questions: QuestionCollection = [
  {
    type: 'input',
    name: 'inPath',
    message: 'Enter the file path:',
    async validate(value) {
      try {
        const file = await fileService.get(_path.resolve(value))

        if (!file) return 'The path entered must be a file, not a directory.'
        return true
      } catch (error: any) {
        return error?.message ?? 'An error occurred in the operation.'
      }
    }
  },
  {
    type: 'input',
    name: 'outPath',
    message: 'Specify the output file path:',
    validate: (value: string) => validateFilePath(value) || 'The path is invalid.'
  },
  {
    type: 'editor',
    name: 'description',
    message: 'Describe the tests you need?'
  }
]

export async function testGenerationPrompt (): Promise<void> {
  const answers = await inquirer.prompt(questions)

  const { inPath, outPath, description } = answers

  const spinner = ora(MESSAGE_FEEDBACK).start()

  try {
    const strategy = new TestGenerationStrategy()

    await strategy.execute({
      inputPath: inPath,
      outputPath: outPath,
      description
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
