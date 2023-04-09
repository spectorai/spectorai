import { testGenerationPrompt } from './testGenerationPrompt.js'
import { commands } from '../declarations.js'

export const promptsMap = new Map([
  [commands.TestGeneration, testGenerationPrompt]
])
