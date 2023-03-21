import * as zod from 'zod'

export const loginFormValidationSchema = zod.object({
  email: zod
    .string()
    .nonempty('O campo e-mail não pode estar vazio')
    .email('Formato de e-mail inválido.'),
  password: zod.string().nonempty('O campo senha não pode estar vazio'),
  remember: zod.boolean(),
})

export const settingsFormValidationSchema = zod
  .object({
    email: zod
      .string()
      .nonempty('O campo e-mail não pode estar vazio')
      .email('Formato de e-mail inválido.'),
    name: zod.string(),
    password: zod.string(),
    passwordConfirmation: zod.string(),
    apiUrl: zod.string(),
    accessKey: zod.string(),
    secretKey: zod.string(),
  })
  .superRefine(({ password, passwordConfirmation }, ctx) => {
    if (password && password !== passwordConfirmation) {
      ctx.addIssue({
        path: ['passwordConfirmation'],
        code: 'custom',
        message: 'A senha e a confirmação não estão iguais',
      })
    }
  })
