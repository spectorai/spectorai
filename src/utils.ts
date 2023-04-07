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
