import axios, { AxiosErrorDefault } from 'axios'

import { UserDTO } from '../dtos/userDTO'
import { env } from '../env'

const API_URL = env.VITE_APP_API

export async function getUserData(token: string) {
  const { data } = await axios.get(`${API_URL}/userData`, {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  })

  return data
}

export async function updateUserData(
  user: UserDTO & { password: string | null },
  token: string,
) {
  try {
    const { data } = await axios.patch(
      `${API_URL}/userData`,
      {
        user,
      },
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      },
    )

    return {
      data: data as UserDTO,
      success: true,
      message: 'Dados salvos com sucesso!',
    }
  } catch (error) {
    const err = error as AxiosErrorDefault

    const message =
      err.response?.data.message || 'Não foi possível salvar os dados.'
    return {
      success: false,
      message,
    }
  }
}
