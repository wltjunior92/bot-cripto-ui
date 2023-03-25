export interface UserDTO {
  name: string
  email: string
  apiUrl: string
  streamUrl: string
  accessKey: string
  secretKey: string | null
}

export interface SymbolDTO {
  symbol: string
  base_precision: number
  quote_precision: number
  min_notional: string
  min_lot_size: string
  is_favorite: boolean
}
