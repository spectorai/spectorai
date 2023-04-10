import dotenv from 'dotenv'

import { MIN_TOKENS_ALLOWED } from './constants.js'

dotenv.config()

export const environments = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_MIN_TOKENS: Number(process.env.OPENAI_MIN_TOKENS || MIN_TOKENS_ALLOWED)
}
