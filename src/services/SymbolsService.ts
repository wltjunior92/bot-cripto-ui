import axios, { AxiosErrorDefault } from 'axios'
import { env } from '../env'
import { RequestNotificationHandlerProps } from '../utils/requestNotificationHandler'

const API_URL = env.VITE_APP_API

export async function getSymbols(token: string) {
  try {
    const { data } = await axios.get(`${API_URL}/symbol`, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })

    return {
      data: data.symbols,
      success: true,
    }
  } catch (error) {
    const err = error as AxiosErrorDefault
    return {
      success: false,
      message: 'Não foi possível carregar os pares',
      errorCode: err.response?.status,
    } as RequestNotificationHandlerProps
  }
}

export async function syncSymbols(token: string) {
  try {
    await axios.post(
      `${API_URL}/symbol/sync`,
      {},
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      },
    )

    return {
      success: true,
      message: 'Pares sincronizados com sucesso!',
    }
  } catch (error) {
    const err = error as AxiosErrorDefault
    return {
      success: false,
      message: 'Não foi possível sincronizar os pares',
      errorCode: err.response?.status,
    } as RequestNotificationHandlerProps
  }
}
