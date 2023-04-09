#!/usr/bin/env node

import inquirer, { QuestionCollection } from 'inquirer'

import { promptsMap } from './prompts/index.js'
import { commands } from './declarations.js'

const question: QuestionCollection = {
  type: 'list',
  name: 'command',
  message: 'Select the command you want to run?',
  choices: [
    {
      name: 'Generation testing',
      value: commands.TestGeneration
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
};

(async () => {
  const answers = await inquirer.prompt(question)

  const { command } = answers

  const prompt = promptsMap.get(command) as (() => Promise<void>)

  prompt()
})()
