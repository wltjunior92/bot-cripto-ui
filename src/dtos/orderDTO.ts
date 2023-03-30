export type OrderDTO = {
  symbol: string
  order_side: 'BUY' | 'SELL'
  order_type: string
  quantity: string
  limit_price?: string
  options?: {
    iceberg_quantity?: string
    stop_price?: string
    order_type?: string
  }
  order_id?: string
  client_order_id?: string
  order_status?: string
  net?: string
  avg_price?: string
  transact_time?: number
  is_maker?: boolean
  commission?: string
  obs?: string
  automation_id?: string
  id?: string
}
