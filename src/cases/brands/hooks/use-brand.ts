import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { BrandService } from '../services/brand.service'
import type { BrandDTO } from '../dtos/brand.dto'
import { toast } from 'react-toastify'

export function useBrands() {
  return useQuery<BrandDTO[]>({
    queryKey: ['brands'],
    queryFn: BrandService.list,
  })
}

export function useBrand(id: string) {
  return useQuery<BrandDTO>({
    queryKey: ['brand', id],
    queryFn: () => BrandService.getById(id),
    enabled: !!id, //-> or Boolean(id)
  })
}

export function useCreateBrand() {
  const queryClient = useQueryClient()

  return useMutation<BrandDTO, Error, Omit<BrandDTO, 'id'>>({
    mutationFn: (brand: Omit<BrandDTO, 'id'>) => BrandService.create(brand),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] })
      toast.success('Registro adicionado com sucessso!')
    },
    onError: (error) => {
      toast.error(`Erro ao adicionar: ${error.message}`)
    },
  })
}

export function useUpdateBrand() {
  const queryClient = useQueryClient()

  return useMutation<BrandDTO, Error, { id: string; brand: BrandDTO }>({
    mutationFn: ({ id, brand }) => BrandService.update(id, brand),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] })
      toast.success('Registro alterado com sucessso!')
    },
    onError: (error) => {
      toast.error(`Erro ao alterar: ${error.message}`)
    },
  })
}

export function useDeleteBrand() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: (id: string) => BrandService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] })
      toast.success('Registro exluído com sucessso!')
    },
    onError: (error) => {
      toast.error(`Erro ao excluir: ${error.message}`)
    },
  })
}
