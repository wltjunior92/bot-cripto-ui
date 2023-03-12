import * as zod from 'zod'

export const loginFormValidationSchema = zod.object({
  email: zod
    .string()
    .nonempty('O campo e-mail não pode estar vazio')
    .email('Formato de e-mail inválido.'),
  password: zod.string().nonempty('O campo senha não pode estar vazio'),
  remember: zod.boolean(),
})
