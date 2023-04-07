import { appendFile, readFile, writeFile } from 'node:fs/promises'

import { checkFileExist, getExtFromFilename } from './utils.js'
import { commands, Payload } from './declarations.js'
import { generateTestPrompt } from './prompts.js'
import { openai } from './openai.js'

export async function generationTesting(data: Payload) {
  const { description, inputPath, outputPath, writeMode = 'overwrite' } = data

  const ext = getExtFromFilename(inputPath)

  console.log('writemode: ', writeMode)

  console.log('input path: ', inputPath)

  console.log('output path: ', outputPath)

  const contentFile = await readFile(inputPath, { encoding: 'utf-8' })

  console.log('content file: ', contentFile)

  const isExist = await checkFileExist(outputPath)

  const outputCode = isExist ? await readFile(outputPath, { encoding: 'utf-8' }) : ''

  console.log('output code: ', outputCode)

  const prompt = generateTestPrompt({
    language: ext,
    targetCode: contentFile,
    description,
    outputCode
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
