import { api } from '../../../lib/axios'
import type { CityDTO } from '../../customers/dtos/customer.dto'

const _ENDPOINT = '/cities'

export const CityService = {
  async list(): Promise<CityDTO[]> {
    const result = await api.get(_ENDPOINT)
    return result.data
  },

  async getById(id: string): Promise<CityDTO> {
    const result = await api.get(`${_ENDPOINT}/${id}`)
    return result.data
  },
}
