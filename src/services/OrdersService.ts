import axios, { AxiosErrorDefault } from 'axios'

import { OrderDTO } from '../dtos/orderDTO'
import { env } from '../env'
import { AddOrViewOrderFormData } from '../pages/AddOrViewOrder'
import { STOP_TYPES } from '../utils/constants'
import { RequestNotificationHandlerProps } from '../utils/requestNotificationHandler'

const API_URL = env.VITE_APP_API

export async function postOrderService(
  values: AddOrViewOrderFormData,
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
      message: 'Não foi possível listar as ordens.',
      errorCode: err.response?.status,
    } as RequestNotificationHandlerProps
  }
}

export async function cancelOrder(
  symbol: string,
  orderId: string,
  token: string,
) {
  try {
    const { data } = await axios.delete(
      `${API_URL}/orders/${symbol}/${orderId}`,
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      },
    )

    return {
      data,
      success: true,
      message: 'Ordem cancelada com sucesso.',
    }
  } catch (error) {
    const err = error as AxiosErrorDefault
    return {
      success: false,
      message: 'Não foi cancelar a ordem.',
      errorCode: err.response?.status,
    } as RequestNotificationHandlerProps
  }
}

export async function getOrder(orderId: string, token: string) {
  try {
    const { data } = await axios.get(`${API_URL}/orders/findById/${orderId}`, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })

    const order: OrderDTO = {
      symbol: data.order.symbol,
      order_side: data.order.order_side,
      order_type: data.order.order_type,
      quantity: data.order.quantity,
      limit_price: data.order.limit_price || '',
      options: {
        iceberg_quantity: data.order.iceberg_quantity || '',
        stop_price: data.order.stop_price || '',
      },
      order_id: data.order.order_id || '',
      client_order_id: data.order.client_order_id || '',
      order_status: data.order.order_status || '',
      net: data.order.net || '',
      avg_price: data.order.avg_price || '',
      transact_time: data.order.transact_time
        ? parseFloat(data.order.transact_time)
        : 0,
      is_maker: data.order.is_maker || '',
      commission: data.order.commission || '',
      obs: data.order.obs || '',
      automation_id: data.order.automation_id || '',
      id: data.order.id || '',
    }

    return {
      data: order,
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

export async function syncOrder(id: string, full = false, token: string) {
  try {
    const { data } = await axios.post(
      `${API_URL}/orders/sync/${id}`,
      {},
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      },
    )

    if (full) {
      return {
        data,
        success: true,
        message: 'Ordem sincronizada.',
      }
    }

    const order: OrderDTO = {
      symbol: data.order.symbol,
      order_side: data.order.order_side,
      order_type: data.order.order_type,
      quantity: data.order.quantity,
      limit_price: data.order.limit_price || '',
      options: {
        iceberg_quantity: data.order.iceberg_quantity || '',
        stop_price: data.order.stop_price || '',
      },
      order_id: data.order.order_id || '',
      client_order_id: data.order.client_order_id || '',
      order_status: data.order.order_status || '',
      net: data.order.net || '',
      avg_price: data.order.avg_price || '',
      transact_time: data.order.transact_time
        ? parseFloat(data.order.transact_time)
        : 0,
      is_maker: data.order.is_maker || '',
      commission: data.order.commission || '',
      obs: data.order.obs || '',
      automation_id: data.order.automation_id || '',
      id: data.order.id || '',
    }

    return {
      data: order,
      success: true,
      message: 'Ordem sincronizada.',
    }
  } catch (error) {
    const err = error as AxiosErrorDefault
    return {
      success: false,
      message: 'Não foi possível sincronizar a ordem.',
      errorCode: err.response?.status,
    } as RequestNotificationHandlerProps
  }
}
