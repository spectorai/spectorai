import { appendFile, readFile, writeFile } from 'node:fs/promises'
import { encode } from 'gpt-3-encoder'
import path from 'node:path'

import { checkFileExist, getExtFromFilename } from './utils.js'
import { commands, Payload } from './declarations.js'
import { generateTestPrompt } from './prompts.js'
import { createCompletion } from './openai.js'
import { ENCODING } from './constants.js'

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

  const completion = await createCompletion({ prompt })

  const outputContentFile = completion?.text as string
  
  writeMode === 'overwrite' 
    ? await writeFile(outputPath, outputContentFile, ENCODING)
    : await appendFile(outputPath, outputContentFile, ENCODING)

  console.log('Your test was created successfully.')
}

export const strategies = {
  [commands.GenerationTesting]: generationTesting
}
