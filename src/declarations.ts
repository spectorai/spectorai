/**
 * Possible values for the write mode.
 */
export type WriteMode = 'overwrite' | 'append'

/**
 * An interface representing a prompt object.
 */
export interface Prompt {
  /**
   * The code snippet to be executed.
   */
  code: string;
  /**
   * The programming language of the code snippet.
   */
  languague: string;
  /**
   * A brief description of the prompt.
   */
  description: string
}

/**
 * An interface representing a payload object.
 */
export interface Payload {
  /**
   * The command to be executed.
   */
  command: string;
  /**
   * The path to the input file.
   */
  inputPath: string;
  /**
   * The path to the output file.
   */
  outputPath: string;
  /**
   * A brief description of the payload.
   */
  description: string;
  /**
   * he write mode for the output file.
   */
  writeMode: WriteMode;
}

/**
 * Represents the base properties of a prompt.
 * @interface
 */
export interface BasePrompt {
  /**
   * The code to be targeted by the prompt.
   * @type {string}
   */
  targetCode: string;

  /**
   * A description of the prompt.
   * @type {string}
   */
  description: string;

  /**
   * The programming language of the target code.
   * @type {string}
   */
  language: string;
}

/**
 * Represents a prompt for running tests.
 * @interface
 * @extends BasePrompt
 */
export interface TestPrompt extends BasePrompt {
  /**
   * The test code to be run against the target code.
   *
   * @type {string=}
   */
  outputCode?: string;
  /**
   * Specifies the path of the file that represents the input code.
   *
   * @type {string}
   */
  targetCodePath: string;
}

export const commands = {
  GenerationTesting: 'GTT',
  GenerationDocumentation: 'GD',
  BugDetection: 'BD',
  ExplainedCode: 'EC',
  // GenerationTypes: 'GT',
  GenerationFuntions: 'GF'
}
