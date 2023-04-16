import inquirer, { QuestionCollection } from 'inquirer'

import { commands } from '../declarations.js'

import { testGenerationPrompt } from './test-generation/test-generation.prompt.js'

const question: QuestionCollection = {
  type: 'list',
  name: 'command',
  message: 'Select the command you want to run?',
  choices: [
    {
      name: 'Generation testing',
      value: commands.TestGeneration
    }
    // {
    //   name: 'Generation documentation',
    //   value: commands.GenerationDocumentation
    // },
    // {
    //   name: 'Bug detection',
    //   value: commands.BugDetection
    // },
    // {
    //   name: 'Explained code',
    //   value: commands.ExplainedCode
    // },
    // {
    //   name: 'Generation functions',
    //   value: commands.GenerationFuntions
    // }
  ]
}

/**
 * Initializes a prompt by asking the user for a command, and runs the appropriate prompt based on their selection.
 *
 * @async
 * @returns {Promise<void>}
*/
export async function initPrompt (): Promise<void> {
  const answers = await inquirer.prompt(question)

  const { command } = answers

  const prompt = promptsMap.get(command) as (() => Promise<void>)

  prompt()
}

export const promptsMap = new Map([
  [commands.TestGeneration, testGenerationPrompt]
])
