import { api } from '../../../lib/axios'
import type { ProductDTO } from '../dtos/product.dto'

const _ENDPOINT = '/products'

export const ProductService = {
  async list(): Promise<ProductDTO[]> {
    const result = await api.get(_ENDPOINT)
    return result.data
  },

  async create(product: ProductDTO): Promise<ProductDTO> {
    const result = await api.post(_ENDPOINT, product)
    return result.data
  },

  async getById(id: string): Promise<ProductDTO> {
    const result = await api.get(`${_ENDPOINT}/${id}`)
    return result.data
  },

  async update(id: string, product: ProductDTO): Promise<ProductDTO> {
    const result = await api.put(`${_ENDPOINT}/${id}`, product)
    return result.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`${_ENDPOINT}/${id}`)
  },
}
