import { TestPrompt } from './declarations.js'

/**
 * Generate a test prompt string based on a TestPrompt object.
 * 
 * @param {TestPrompt} prompt - The TestPrompt object to generate the prompt from.
 * @returns {string} The generated prompt string.
 * @example
 * 
 * const prompt = {
 *   language: 'javascript',
 *   targetCode: 'function add(a, b) { return a + b; }',
 *   description: 'Write a function that adds two numbers together.',
 *   outputCode: 'console.log(add(2, 3)); // Output: 5'
 * }
 * 
 * generateTestPrompt(prompt)
 * // ## Input code
 * 
 * // ```javascript
 * // function add(a, b) { return a + b; }
 * // ```
 * 
 * // ## Indications
 * 
 * // Write a function that adds two numbers together.
 * 
 * // ## Output code
 * 
 * // ```javascript
 * // console.log(add(2, 3));
 */
export const generateTestPrompt = (prompt: TestPrompt): string => {
  const { language, targetCode, targetCodePath, description, outputCode = '' } = prompt

  const promptChunks = [
    // Target code
    '## Target code',
    `\`\`\`${language} [${targetCodePath}]`,
    `${targetCode}`,
    '```',

    // Indications
    '## Indications',
    description,

    // Test code
    '## Test code',
    `\`\`\`${language}`,
    outputCode
  ]

  return promptChunks.join('\n')
}
