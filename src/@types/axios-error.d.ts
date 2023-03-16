import { AxiosError } from 'axios'

declare module 'axios' {
  export interface AxiosErrorDefault extends AxiosError {
    response?: {
      data: {
        message: string
      }
    }
  }
}
