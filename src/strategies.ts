import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { getExtFromFilename } from './utils.js'
import { commands } from './declarations.js'
import { openai } from './openai.js'

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
}

export function buildingPromptForTest ({ languague, code, description }: Prompt): string {
  const prompt = [
    `## Input code\n\n\`\`\`${languague}\n${code}\n\`\`\`\n`,
    `## Indications\n\n${description}\n`,
    `## Output code\n\n\`\`\`${languague}`
  ]

  return prompt.join('\n')
}

export async function generationTesting(data: Payload) {
  console.log(data)

  const { description, inputPath, outputPath } = data

  const fullpath = path.resolve(inputPath)

  const ext = getExtFromFilename(fullpath)

  const outputFullpath = path.resolve(outputPath)

  console.log('fullpath: ', fullpath)

  const contentFile = await readFile(fullpath, { encoding: 'utf-8' })

  console.log('content file: ', contentFile)

  const prompt = buildingPromptForTest({
    languague: ext,
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

export const strategies = {
  [commands.GenerationTesting]: generationTesting
}
