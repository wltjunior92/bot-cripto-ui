import axios from 'axios'
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
