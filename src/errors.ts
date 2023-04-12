/**
 * Error that is thrown when the maximum number of tokens allowed is exceeded.
 *
 * @class
 * @extends Error
 */
export class MaximumTokensExceededError extends Error {
  /**
   * The name of the error class.
   *
   * @type {string}
   */
  name: string = MaximumTokensExceededError.name

  /**
   * Creates an instance of MaximumTokensExceededError with a specified error message.
   *
   * @param {string} message The error message to display.
   */
  constructor (message: string) {
    super(message)
  }
}

// /**
//  * Error thrown when an API key has not been configured.
//  *
//  * @class
//  * @extends Error
//  */
// export class ApiKeyError extends Error {
//   /**
//    * The name of the error class.
//    *
//    * @type {string}
//    */
//   name: string = ApiKeyError.name

//   /**
//    * Creates an ApiKeyError instance with a specified error message.
//    *
//    * @param {string} message The error message to display.
//    */
//   constructor(message: string) {
//     super(message)
//   }
// }
