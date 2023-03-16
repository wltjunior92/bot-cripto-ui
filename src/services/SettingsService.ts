import axios from 'axios'
import { env } from '../env'

const API_URL = env.VITE_APP_API

export async function getSettings(token: string) {
  const { data } = await axios.get(`${API_URL}/settings`, {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  })

  return data
}
