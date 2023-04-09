import { stat, access, constants, readFile, writeFile, appendFile } from 'node:fs/promises'
import inquirer, { QuestionCollection } from 'inquirer'
// import { encode } from 'gpt-3-encoder'
import path from 'node:path'
import ora from 'ora'

import { checkFileExist, clearConsole, closeProgram, getExtFromFilename, printMessage, validateFilePath } from '../utils.js'
import { generateTestPrompt } from '../prompts.js'
import { createCompletion } from '../openai.js'
import { Payload } from '../declarations.js'
import { ENCODING } from '../constants.js'

import { confirmationPrompt } from './sharedPrompts.js'
import { initPrompt } from './initialPrompt.js'

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

  const inputFullpath = path.resolve(inputPath)

  const outputFullpath = path.resolve(outputPath)

  const ext = getExtFromFilename(inputFullpath)

  // console.log('writemode: ', writeMode)

  // console.log('input path: ', inputFullpath)

  // console.log('output path: ', outputFullpath)

  const contentFile = await readFile(inputFullpath, ENCODING)

  // console.log('content file: ', contentFile)

  const isExist = await checkFileExist(outputFullpath)

  const outputCode = isExist ? await readFile(outputFullpath, ENCODING) : ''

  // console.log('output code: ', outputCode)

  const prompt = generateTestPrompt({
    language: ext,
    targetCode: contentFile,
    targetCodePath: inputPath,
    description,
    outputCode
  })

  // console.log('prompt: ', prompt)

  // console.log('number tokens: ', encode(prompt).length)

  const completion = await createCompletion({ prompt })

  const outputContentFile = completion?.text as string
  
  writeMode === 'overwrite' 
    ? await writeFile(outputPath, outputContentFile, ENCODING)
    : await appendFile(outputPath, outputContentFile, ENCODING)
}

export async function testGenerationPrompt (): Promise<void> {
  const answers = await inquirer.prompt(questions)

  const { inputPath, outputPath, description, writeMode } = answers

  const spinner = ora('Your tests are being generated, please wait a moment...').start()

  try {
    await generateTest({
      inputPath,
      outputPath,
      description,
      writeMode
    })

    spinner.succeed('Your test was created successfully.')

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
