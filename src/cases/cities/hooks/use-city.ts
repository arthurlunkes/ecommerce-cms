import { useQuery } from '@tanstack/react-query'
import type { CityDTO } from '../../customers/dtos/customer.dto'
import { CityService } from '../services/city.service'

export function useCities() {
  return useQuery<CityDTO[]>({
    queryKey: ['cities'],
    queryFn: CityService.list,
  })
}
