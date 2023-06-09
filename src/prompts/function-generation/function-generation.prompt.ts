import inquirer, { QuestionCollection } from 'inquirer'
import _path from 'node:path'
import ora from 'ora'

import { clearConsole, closeProgram, printMessage, validateFilePath } from '../../utils.js'

import { confirmationPrompt } from '../shared.js'
import { initPrompt } from '../index.js'

import { firstChunkPrompt as prompt } from './function-generation.template.js'
import { FunctionGenerationStrategy } from './function-generation.strategy.js'

const MESSAGE_FEEDBACK = 'Your function is being generated, please wait a moment...'

const MESSAGE_SUCCEEDED = 'Your function was created successfully.'

const questions: QuestionCollection = [
  {
    type: 'input',
    name: 'outPath',
    message: 'Specify the output file path:',
    validate: (value: string) => validateFilePath(value) || 'The path is invalid.'
  },
  {
    type: 'editor',
    name: 'description',
    message: 'Describe your function?',
    default: () => prompt
  }
]

export async function functionGenerationPrompt (): Promise<void> {
  const answers = await inquirer.prompt(questions)

  const { outPath, description, writeMode } = answers

  const spinner = ora(MESSAGE_FEEDBACK).start()

  try {
    const strategy = new FunctionGenerationStrategy()

    await strategy.execute({
      outputPath: outPath,
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
