import { api } from '../../../lib/axios'
import type { CustomerDTO } from '../dtos/customer.dto'

const _ENDPOINT = '/customers'

export const CustomerService = {
  async list(): Promise<CustomerDTO[]> {
    const result = await api.get(_ENDPOINT)
    return result.data
  },

  async create(customer: CustomerDTO): Promise<CustomerDTO> {
    const result = await api.post(_ENDPOINT, customer)
    return result.data
  },

  async getById(id: string): Promise<CustomerDTO> {
    const result = await api.get(`${_ENDPOINT}/${id}`)
    return result.data
  },

  async update(id: string, customer: CustomerDTO): Promise<CustomerDTO> {
    const result = await api.put(`${_ENDPOINT}/${id}`, customer)
    return result.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`${_ENDPOINT}/${id}`)
  },
}
