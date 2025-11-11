import { api } from '../../../lib/axios'
import type { OrderDTO } from '../dtos/order.dto'

const _ENDPOINT = '/orders'

export const OrderService = {
  async list(): Promise<OrderDTO[]> {
    const result = await api.get(_ENDPOINT)
    return result.data
  },

  async getById(id: string): Promise<OrderDTO> {
    const result = await api.get(`${_ENDPOINT}/${id}`)
    return result.data
  },
}
