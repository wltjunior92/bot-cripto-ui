import { JsonValue } from 'react-use-websocket/dist/lib/types'

export type JsonMessageProps = JsonValue & {
  miniTicker: JsonValue
  book: any[]
  balance: JsonValue
  b: string
  a: string
}
