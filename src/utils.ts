import { access } from 'node:fs/promises'
import emoji from 'node-emoji'
import _path from 'node:path'

import { Message } from './declarations.js'

/**
 * Extracts the file extension from a filename by removing any characters
 * that come before the last dot (including the dot).
 *
 * @param filename - the filename to extract the extension from
 * @returns the file extension as a string
 */
export function getExtFromFilename(filename: string): string {
  return filename.replace(/^.*\.([^.]+)$/, "$1");
}

/**
 * Validates a file path without checking if the file actually exists.
 *
 * @param {string} inputPath The file path to validate.
 * @returns {boolean} `true` if the file path is valid, `false` otherwise.
 * @example
 *
 * const isValid = validateFilePath('/path/to/file.txt');
 * const isInvalid = validateFilePath('../path/to/file.txt');
 */
export function validateFilePath(inputPath: string): boolean {
  // Resolve path.
  const filePath = _path.resolve(inputPath)
  
  // Check if the path is absolute
  if (!_path.isAbsolute(filePath)) return false

  // Normalize the path to remove any redundant or dangerous elements
  const normalizedPath = _path.normalize(filePath)

  // Check if the normalized path is the same as the original path
  // This will detect any attempts to inject relative paths or other tricks
  if (normalizedPath !== filePath) return false

  // Check if the file path has an extension
  if (!_path.extname(filePath)) return false

  return true
}

/**
 * Checks if a path exists in the given path and returns a boolean value as a result.
 *
 * @async
 * @param {string} filePath - The path of the file to check.
 * @returns {Promise<boolean>} A boolean value indicating whether the file exists or not.
 */
export async function hasPathAccess (filePath:string): Promise<boolean> {
  try {
    await access(_path.resolve(filePath))
    return true
  } catch (error) {
    return false
  }
}

/**
 * Clears the console.
 *
 * @returns {void}
 */
export const clearConsole = (): void => console.clear()

/**
 * Prints a message to the console, optionally with start and end emojis.
 *
 * @param {Message} data An object containing the message to print and optional start and end emojis.
 * @returns {void}
 */
export function printMessage(data: Message): void {
  const startEmoji = emoji.get(data.startEmoji || '')
  const endEmoji = emoji.get(data.endEmoji || '')

  console.log(`${startEmoji} ${data.message} ${endEmoji}`)
}

/**
 * Closes the program.
 *
 * @returns {void}
 */
export const closeProgram = (): void => process.exit(1)
