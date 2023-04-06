import dotenv from 'dotenv'

dotenv.config()

export const environments = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY
}
