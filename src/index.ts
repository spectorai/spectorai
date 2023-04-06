import inquirer, { QuestionCollection } from 'inquirer'

import { commands } from './declarations.js'
import { strategies } from './strategies.js'

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
    type: 'rawlist',
    name: 'languague',
    choices: [
      {
        name: 'Javascript',
        value: 'js'
      },
      {
        name: 'Typescript',
        value: 'ts'
      }
    ]
  },
  {
    type: 'input',
    name: 'inputPath',
    message: 'Enter the file path:'
  },
  {
    type: 'input',
    name: 'outputPath',
    message: 'Specify the output file path:'
  },
  {
    type: 'editor',
    name: 'description',
    message: 'Describe the tests you need?'
  }
];

(async () => {
  const data = await inquirer.prompt(questions)

  const { command, languague, inputPath, outputPath, description } = data

  const strategy = strategies[command]

  try {
    await strategy({
      command,
      languague,
      inputPath,
      outputPath,
      description
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
