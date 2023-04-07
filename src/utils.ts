import path from 'node:path'

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
 * @param {string} filePath The file path to validate.
 * @returns {boolean} `true` if the file path is valid, `false` otherwise.
 * @example
 *
 * const isValid = validateFilePath('/path/to/file.txt');
 * const isInvalid = validateFilePath('../path/to/file.txt');
 */
export function validateFilePath(filePath: string): boolean {
  // Check if the path is absolute
  if (!path.isAbsolute(filePath)) return false

  // Normalize the path to remove any redundant or dangerous elements
  const normalizedPath = path.normalize(filePath)

  // Check if the normalized path is the same as the original path
  // This will detect any attempts to inject relative paths or other tricks
  if (normalizedPath !== filePath) return false

  // Check if the file path has an extension
  if (!path.extname(filePath)) return false

  return true
}
