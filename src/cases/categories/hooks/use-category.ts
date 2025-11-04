import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CategoryService } from '../services/category.service'
import type { CategoryDTO } from '../dtos/category.dto'
import { toast } from 'react-toastify'

export function useCategories() {
  return useQuery<CategoryDTO[]>({
    queryKey: ['categories'],
    queryFn: CategoryService.list,
  })
}

export function useCategory(id: string) {
  return useQuery<CategoryDTO>({
    queryKey: ['category', id],
    queryFn: () => CategoryService.getById(id),
    enabled: !!id, //-> or Boolean(id)
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation<CategoryDTO, Error, Omit<CategoryDTO, 'id'>>({
    mutationFn: (category: Omit<CategoryDTO, 'id'>) =>
      CategoryService.create(category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Registro adicionado com sucessso!')
    },
    onError: (error) => {
      toast.error(`Erro ao adicionar: ${error.message}`)
    },
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation<CategoryDTO, Error, { id: string; category: CategoryDTO }>(
    {
      mutationFn: ({ id, category }) => CategoryService.update(id, category),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['categories'] })
        toast.success('Registro alterado com sucessso!')
      },
      onError: (error) => {
        toast.error(`Erro ao alterar: ${error.message}`)
      },
    },
  )
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: (id: string) => CategoryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Registro exluído com sucessso!')
    },
    onError: (error) => {
      toast.error(`Erro ao excluir: ${error.message}`)
    },
  })
}
