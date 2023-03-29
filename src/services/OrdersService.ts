import axios, { AxiosErrorDefault } from 'axios'

import { OrderDTO } from '../dtos/orderDTO'
import { env } from '../env'
import { NewOrderFormData } from '../pages/NewOrder'
import { STOP_TYPES } from '../utils/constants'
import { RequestNotificationHandlerProps } from '../utils/requestNotificationHandler'

const API_URL = env.VITE_APP_API

export async function postOrderService(
  values: NewOrderFormData,
  orderSide: 'BUY' | 'SELL',
  token: string,
) {
  const newOrder: OrderDTO = {
    symbol: values.symbol as string,
    order_side: orderSide,
    order_type: values.order_type as string,
    quantity: values.quantity,
  }

  if (values.order_type !== 'MARKET') {
    newOrder.limit_price = values.limit_price
  }
  if (values.order_type === 'ICEBERG') {
    newOrder.options = {
      ...newOrder.options,
      iceberg_quantity: values.options.iceberg_quantity,
    }
  }
  if (STOP_TYPES.includes(values.order_type)) {
    newOrder.options = {
      ...newOrder.options,
      stop_price: values.options.stop_price,
      order_type: values.order_type,
    }
  }
  try {
    const { data } = await axios.post(`${API_URL}/orders`, newOrder, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })

    return {
      data,
      success: true,
      message: 'Ordem enviada com sucesso!',
    }
  } catch (error) {
    const err = error as AxiosErrorDefault
    return {
      success: false,
      message: 'Não foi possível enviar a ordem.',
      errorCode: err.response?.status,
    } as RequestNotificationHandlerProps
  }
}

export async function getOrders(symbol: string, token: string, page?: number) {
  try {
    const { data } = await axios.get(
      `${API_URL}/orders/${symbol || ''}${page ? '?page=' + page : ''}`,
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      },
    )

    return {
      data,
      success: true,
    }
  } catch (error) {
    const err = error as AxiosErrorDefault
    return {
      success: false,
      message: 'Não foi listar as ordens.',
      errorCode: err.response?.status,
    } as RequestNotificationHandlerProps
  }
}
