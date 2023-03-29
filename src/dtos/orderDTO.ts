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
  order_status?: string
}
