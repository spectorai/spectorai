import { CreateCompletionRequest } from 'openai'

/**
 * An interface representing a request for text completion using an AI language model.
 * @interface
 */
export interface CompletionRequest extends Omit<CreateCompletionRequest, 'prompt'> {
  /**
   * The prompt text to use as a starting point for text completion.
   * @type {string}
   */
  prompt: string;
}

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
  inCode: string;

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
   * The test code to be run against the target code.   *
   * @type {string=}
   */
  outCode?: string;
  /**
   * Specifies the path of the file that represents the input code.
   * @type {string}
   */
  inPath: string;
  /**
   * Specifies the path of the file that represents the output code.
   * @type {string}
   */
  outPath: string;
}

/**
 * An object representing a message, optionally with start and end emojis.
 * @interface
 */
export interface Message {
  /**
   * The message to display.
   */
  message: string;
  /**
   * An optional start emoji.
   */
  startEmoji?: string;
  /**
   * An optional end emoji.
   */
  endEmoji?: string;
}

/**
 * A `Record` object representing a query.
 */
export type Query = Record<string, unknown>

/**
 * A type that can be a string or a number to represent an ID.
 */
export type Id = string | number

/**
 * A type representing the file type, can be 'file' or 'dir'.
 */
export type FileType = 'file' | 'dir'

/**
 * An interface that defines common service methods.
 * @interface ServiceMethods
 * @template T The input data type.
 * @template K The type of data returned.
 */
export interface ServiceMethods<T, K> {
  /**
   * Method responsible for creating a resource.
   * @function create
   * @memberof ServiceMethods
   * @instance
   * @param {T} data The data representing the data to create.
   * @param {Query} [query] Represents additional parameters.
   * @returns {Promise<K>} Promise containing the created data.
   */
  create (data: T, query?: Query): Promise<K>;
  /**
   * Method responsible for obtaining a resource based on an ID.
   * @function get
   * @memberof ServiceMethods
   * @instance
   * @param {Id} id The ID of the resource.
   * @param {Query} [query] Represents additional parameters.
   * @returns {Promise<K | null>} A promise that resolves to the fetched data or `null` if the record is not found.
   */
  get (id: Id, query?: Query): Promise<K | null>;
}

export interface FileSystem {
  /**
   * The name of the file or directory.
   * @memberof FileSystem
   * @instance
   */
  name: string;
  /**
   * The directory path that contains the file or directory.
   * @memberof FileSystem
   * @instance
   */
  dir: string;
  /**
   * The full path of the file or directory.
   * @memberof FileSystem
   * @instance
   */
  path: string;
  /**
   * The type of file or directory.
   * @memberof FileSystem
   * @instance
   */
  type: FileType;
  /**
   * The file extension (optional).
   * @memberof FileSystem
   * @instance
   */
  ext: string | null | undefined;
  /**
   * The size of the file in bytes.
   * @memberof FileSystem
   * @instance
   */
  size: number;
  /**
   * The content of the file (optional).
   * @memberof FileSystem
   * @instance
   */
  content: string | null | undefined;
  /**
   * The date the file or directory was created.
   * @memberof FileSystem
   * @instance
   */
  createdAt: Date;
  /**
   * The last modified date of the file or directory.
   * @memberof FileSystem
   * @instance
   */
  updatedAt: Date;
}

export interface Strategy<T = unknown, K = unknown> {
  execute (data: T): Promise<K>
}

export const commands = {
  TestGeneration: 'TG',
  GenerationDocumentation: 'GD',
  BugDetection: 'BD',
  ExplainedCode: 'EC',
  // GenerationTypes: 'GT',
  GenerationFuntions: 'GF'
}
