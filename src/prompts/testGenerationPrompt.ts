import { stat, access, constants } from 'node:fs/promises'
import inquirer, { QuestionCollection } from 'inquirer'
import path from 'node:path'
import ora from 'ora'

import { clearConsole, closeProgram, printMessage, validateFilePath } from '../utils.js'
import { Payload, FileSystem } from '../declarations.js'
import { createCompletion } from '../config/openai.js'
import { generateTestPrompt } from '../templates.js'

import { DirectoryService } from '../services/directory.service.js'
import { FileService } from '../services/file.service.js'

import { confirmationPrompt } from './sharedPrompts.js'
import { initPrompt } from './initialPrompt.js'

const MESSAGE_FEEDBACK = 'Your tests are being generated, please wait a moment...'

const MESSAGE_SUCCEEDED = 'Your test was created successfully.'

const fileService = new FileService()

const directoryService = new DirectoryService()

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
    }
  },
  {
    type: 'editor',
    name: 'description',
    message: 'Describe the tests you need?'
  }
]

export async function generateTest (data: Omit<Payload, 'command'>) {
  const { description, inputPath, outputPath, writeMode = 'overwrite' } = data

  const inFile = await fileService.get(inputPath) as FileSystem

  const prompt = generateTestPrompt({
    language: inFile.ext as string,
    targetCode: inFile.content as string,
    targetCodePath: inputPath,
    description
  })

  const outFullpath = path.resolve(outputPath)

  const completion = await createCompletion({ prompt })

  const outContent = completion?.text as string

  const { dir: outputDir } = path.parse(outFullpath)

  if (!(await directoryService.get(outputDir))) {
    await directoryService.create({ path: outputDir })
  }

  return fileService.create(
    {
      path: outFullpath,
      content: outContent
    },
    {
      mode: writeMode
    }
  )
}

export async function testGenerationPrompt (): Promise<void> {
  const answers = await inquirer.prompt(questions)

  const { inputPath, outputPath, description, writeMode } = answers

  const spinner = ora(MESSAGE_FEEDBACK).start()

  try {
    await generateTest({
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
