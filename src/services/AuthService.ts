import axios from 'axios'
import { env } from '../env'

type HandleLoginProps = {
  email: string
  password: string
  remember: boolean
}

const API_URL = env.VITE_APP_API

export async function handleLoginService({
  email,
  password,
}: HandleLoginProps) {
  const { data } = await axios.post(`${API_URL}/sessions`, {
    email,
    password,
  })

  return data.token
}
