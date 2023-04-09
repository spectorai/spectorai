import { Configuration, CreateCompletionResponseChoicesInner, OpenAIApi } from 'openai'
import { encode } from 'gpt-3-encoder'

import { AI_MODEL, TEMPERATURE, TOP_P, MAX_TOKENS_AVAILABLE, PRESENCE_PENALTY, FREQUENCY_PENALTY } from './constants.js'
import { CompletionRequest } from './declarations.js'
import { environments } from './environments.js'

export const configuration = new Configuration({
  apiKey: environments.OPENAI_API_KEY
})

export const openai = new OpenAIApi(configuration)

/**
 * Creates a text completion using the OpenAI API based on the provided request payload.
 * If certain parameters are not provided, default values will be used.
 * 
 * > The `max_tokens` property is returned by the **maximum number of tokens** minus the **number of prompt tokens**.
 * 
 * @async
 * @function
 * @param {Partial<CompletionRequest>} payload An object containing the parameters for the text completion request. Not all parameters are required.
 * @returns {Promise<CreateCompletionResponseChoicesInner>}
 * @throws {Error} If an error occurs when the request has exceeded the maximum available tokens.
 */
export async function createCompletion (payload: Partial<CompletionRequest>): Promise<CreateCompletionResponseChoicesInner> {
  const {
    prompt = '',
    model = AI_MODEL,
    temperature = TEMPERATURE,
    top_p = TOP_P,
    max_tokens,
    presence_penalty = PRESENCE_PENALTY,
    frequency_penalty = FREQUENCY_PENALTY,
    stop = '```'
  } = payload || {}

  const MAX_TOKENS = MAX_TOKENS_AVAILABLE - encode(prompt).length

  if (MAX_TOKENS <= 0) throw new Error('The prompt has exceeded the maximum available tokens.')

  const completion = await openai.createCompletion({
    model,
    prompt,
    temperature,
    top_p,
    max_tokens: max_tokens || MAX_TOKENS,
    presence_penalty,
    frequency_penalty,
    stop
  })

  return completion.data.choices[0]
}
