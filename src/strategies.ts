import { appendFile, readFile, writeFile } from 'node:fs/promises'
import { encode } from 'gpt-3-encoder'
import path from 'node:path'

import { TEMPERATURE, TOP_P, ENCODING, AI_MODEL, MAX_TOKENS_AVAILABLE } from './constants.js'
import { checkFileExist, getExtFromFilename } from './utils.js'
import { commands, Payload } from './declarations.js'
import { generateTestPrompt } from './prompts.js'
import { openai } from './openai.js'

export async function generationTesting(data: Payload) {
  const { description, inputPath, outputPath, writeMode = 'overwrite' } = data

  const inputFullpath = path.resolve(inputPath)

  const outputFullpath = path.resolve(outputPath)

  const ext = getExtFromFilename(inputFullpath)

  console.log('writemode: ', writeMode)

  console.log('input path: ', inputFullpath)

  console.log('output path: ', outputFullpath)

  const contentFile = await readFile(inputFullpath, ENCODING)

  console.log('content file: ', contentFile)

  const isExist = await checkFileExist(outputFullpath)

  const outputCode = isExist ? await readFile(outputFullpath, ENCODING) : ''

  console.log('output code: ', outputCode)

  const prompt = generateTestPrompt({
    language: ext,
    targetCode: contentFile,
    targetCodePath: inputPath,
    description,
    outputCode
  })

  console.log('prompt: ', prompt)

  console.log('number tokens: ', encode(prompt).length)

  const MAX_TOKENS =  MAX_TOKENS_AVAILABLE - encode(prompt).length

  console.log('max tokens: ', MAX_TOKENS)

  if (MAX_TOKENS <= 0) throw new Error('The prompt has exceeded the maximum available tokens.')

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
