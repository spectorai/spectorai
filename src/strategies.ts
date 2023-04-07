import { appendFile, readFile, writeFile } from 'node:fs/promises'

import { getExtFromFilename } from './utils.js'
import { commands } from './declarations.js'
import { openai } from './openai.js'

export type WriteMode = 'overwrite' | 'append'

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
  writeMode: WriteMode;
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
  const { description, inputPath, outputPath, writeMode = 'overwrite' } = data

  const ext = getExtFromFilename(inputPath)

  console.log('writemode: ', writeMode)

  console.log('input path: ', inputPath)

  console.log('output path: ', outputPath)

  const contentFile = await readFile(inputPath, { encoding: 'utf-8' })

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

  const outputContentFile = body?.text as string

  const encoding = 'utf-8'
  
  writeMode === 'overwrite' 
    ? await writeFile(outputPath, outputContentFile, encoding)
    : await appendFile(outputPath, outputContentFile, encoding)

  console.log('Your test was created successfully.')

  return completion
}

export const strategies = {
  [commands.GenerationTesting]: generationTesting
}
