import axios, { AxiosErrorDefault } from 'axios'

import { UserBalanceDTO } from '../dtos/userBalaceDTO'
import { env } from '../env'

const API_URL = env.VITE_APP_API

export async function getBalance(token: string) {
  try {
    const { data } = await axios.get(`${API_URL}/exchange/balance`, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })

    return {
      data: data as UserBalanceDTO,
      success: true,
      message: 'Dados salvos com sucesso!',
    }
  } catch (error) {
    const err = error as AxiosErrorDefault

    const message =
      err.response?.data.message ||
      'Não foi possível carregar os dados da Carteira.'
    return {
      success: false,
      message,
    }
  }
}
