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

  async create(
    data: Omit<OrderDTO, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<OrderDTO> {
    const result = await api.post(_ENDPOINT, data)
    return result.data
  },

  async update(id: string, data: Partial<OrderDTO>): Promise<OrderDTO> {
    const result = await api.put(`${_ENDPOINT}/${id}`, data)
    return result.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`${_ENDPOINT}/${id}`)
  },
}
