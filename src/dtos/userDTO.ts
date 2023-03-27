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
  base_asset: string
  quote_precision: number
  quote_asset: string
  min_notional: string
  min_lot_size: string
  is_favorite: boolean
}
