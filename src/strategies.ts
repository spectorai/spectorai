import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { commands } from './declarations.js'
import { openai } from './openai.js'

/**
 * Generar tipos especificos cuando se interactuen con
 * diferentes modelos.
 */

export interface Prompt {
  code: string;
  languague: string;
  description: string
}

export interface Payload {
  command: string;
  inputPath: string;
  outputPath: string;
  description: string;
  languague: string;
}

export function buildingPromptForTest ({ languague, code, description }: Prompt): string {
  const prompt = [
    '',
    'Input code:',
    '',
    '```' + languague,
    code,
    '```',
    '',
    'Indications:',
    '',
    description,
    '',
    'Output code: ',
    '',
    '```' + languague
  ]

  return prompt.join('\n')
}

export const strategies = {
  [commands.GenerationTesting]: async (data: Payload) => {
    console.log(data)

    const { languague, description, inputPath, outputPath } = data

    const fullpath = path.resolve(inputPath)

    const outputFullpath = path.resolve(outputPath)

    console.log('fullpath: ', fullpath)

    const contentFile = await readFile(fullpath, { encoding: 'utf-8' })

    console.log('content file: ', contentFile)

    const prompt = buildingPromptForTest({
      languague,
      code: contentFile,
      description
    })

    console.log('prompt: ', prompt)

    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt,
      temperature: 0,
      top_p: 0.1,
      max_tokens: 1024,
      stop: '```'
    })

    const body = completion.data.choices.at(0)

    await writeFile(outputFullpath, body?.text as string, { encoding: 'utf-8' })

    console.log('Your test was created successfully.')

    return completion
  }
}
