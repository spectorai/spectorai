import { appendFile, readFile, writeFile } from 'node:fs/promises'

import { TEMPERATURE, MAX_TOKENS, TOP_P, ENCODING, AI_MODEL } from './constants.js'
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

  const contentFile = await readFile(inputPath, ENCODING)

  console.log('content file: ', contentFile)

  const isExist = await checkFileExist(outputPath)

  const outputCode = isExist ? await readFile(outputPath, ENCODING) : ''

  console.log('output code: ', outputCode)

  const prompt = generateTestPrompt({
    language: ext,
    targetCode: contentFile,
    description,
    outputCode
  })

  console.log('prompt: ', prompt)

  const completion = await openai.createCompletion({
    model: AI_MODEL,
    prompt,
    temperature: TEMPERATURE,
    top_p: TOP_P,
    max_tokens: MAX_TOKENS,
    presence_penalty: 0,
    frequency_penalty: 0,
    stop: '```'
  })

  const body = completion.data.choices.at(0)

  const outputContentFile = body?.text as string
  
  writeMode === 'overwrite' 
    ? await writeFile(outputPath, outputContentFile, ENCODING)
    : await appendFile(outputPath, outputContentFile, ENCODING)

  console.log('Your test was created successfully.')

  return completion
}

export const strategies = {
  [commands.GenerationTesting]: generationTesting
}
