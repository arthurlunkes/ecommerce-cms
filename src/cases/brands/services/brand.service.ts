import { api } from '../../../lib/axios'
import type { BrandDTO } from '../dtos/brand.dto'

const _ENDPOINT = '/brands'

export const BrandService = {
  async list(): Promise<BrandDTO[]> {
    const result = await api.get(_ENDPOINT)
    return result.data
  },

  async create(brand: BrandDTO): Promise<BrandDTO> {
    const result = await api.post(_ENDPOINT, brand)
    return result.data
  },

  async getById(id: string): Promise<BrandDTO> {
    const result = await api.get(`${_ENDPOINT}/${id}`)
    return result.data
  },

  async update(id: string, brand: BrandDTO): Promise<BrandDTO> {
    const result = await api.put(`${_ENDPOINT}/${id}`, brand)
    return result.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`${_ENDPOINT}/${id}`)
  },
}
