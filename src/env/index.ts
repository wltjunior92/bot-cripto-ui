import { z } from 'zod'

const envSchema = z.object({
  VITE_APP_API: z.string(),
})

const _env = envSchema.safeParse(import.meta.env)

if (_env.success === false) {
  console.error('❌ Invalid enviroment variables', _env.error.format())

  throw new Error('Invalid enviroment variables.')
}

export const env = _env.data
