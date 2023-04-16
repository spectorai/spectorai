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
 *   inCode: 'function add(a, b) { return a + b; }',
 *   inCodePath: 'src/operations.js',
 *   description: 'Write a function that adds two numbers together.',
 *   outCode: 'console.log(add(2, 3)); // Output: 5',
 *   outCodePath: 'test/operations.spec.js'
 * }
 * 
 * generateTestPrompt(prompt)
 * // ## Input code
 * 
 * // ```javascript [src/operations.js]
 * // function add(a, b) { return a + b; }
 * // ```
 * 
 * // ## Indications
 * 
 * // Write a function that adds two numbers together.
 * 
 * // ## Output code
 * 
 * // ```javascript [test/operations.spec.js]
 * // console.log(add(2, 3));
 */
export const generateTestPrompt = (prompt: TestPrompt): string => {
  const {
    language,
    inCode,
    inPath,
    outPath,
    description,
    outCode = ''
  } = prompt

  const promptChunks = [
    // Target code
    '## Target code',
    `\`\`\`${language} [${inPath}]`,
    `${inCode}`,
    '```',

    // Indications
    '## Indications',
    description,

    // Test code
    '## Test code',
    `\`\`\`${language} [${outPath}]`,
    outCode
  ]

  return promptChunks.join('\n')
}
