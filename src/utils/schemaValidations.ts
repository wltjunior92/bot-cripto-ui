import * as zod from 'zod'

import { STOP_TYPES } from './constants'

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
    streamUrl: zod.string(),
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

export const newOrderFormValidationSchema = zod
  .object({
    symbol: zod.string().or(zod.null()),
    quantity: zod.string().nonempty('É necessário definir a quantidade.'),
    order_side: zod.enum(['BUY', 'SELL']).optional(),
    order_type: zod.enum([
      'NONE',
      'ICEBERG',
      'LIMIT',
      'MARKET',
      'STOP_LOSS',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT',
      'TAKE_PROFIT_LIMIT',
    ]),
    limit_price: zod.string(),
    options: zod.object({
      iceberg_quantity: zod.string().optional(),
      stop_price: zod.string().optional(),
    }),
  })
  .superRefine(({ symbol, order_type, limit_price, options }, ctx) => {
    if (!symbol) {
      ctx.addIssue({
        path: ['symbol'],
        code: 'custom',
        message: 'É necessário selecionar o Par para a operação.',
      })
    }
    if (order_type === 'NONE') {
      ctx.addIssue({
        path: ['order_type'],
        code: 'custom',
        message: 'É necessário selecionar Tipo de operação.',
      })
    }
    if (order_type !== 'MARKET' && !limit_price) {
      ctx.addIssue({
        path: ['limit_price'],
        code: 'custom',
        message: 'O preço é obrigatório.',
      })
    }
    if (order_type === 'ICEBERG' && !options.iceberg_quantity) {
      ctx.addIssue({
        path: ['options.iceberg_quantity'],
        code: 'custom',
        message: 'É obrigatório informar a quantidade da Ordem Iceberg.',
      })
    }
    if (
      order_type !== 'NONE' &&
      STOP_TYPES.includes(order_type) &&
      !options.stop_price
    ) {
      ctx.addIssue({
        path: ['options.stop_price'],
        code: 'custom',
        message: `O campo 'Preço stop' é obrigatório para operações desse tipo`,
      })
    }
  })
