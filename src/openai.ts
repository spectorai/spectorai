import { Configuration, OpenAIApi } from 'openai'

import { environments } from './environments.js'

export const configuration = new Configuration({
  apiKey: environments.OPENAI_API_KEY
})

export const openai = new OpenAIApi(configuration)
