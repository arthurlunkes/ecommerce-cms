import { SidebarForm } from '@/components/layout/sidebar-form'
import { useNavigate, useParams } from 'react-router-dom'
import {
  useBrand,
  useCreateBrand,
  useDeleteBrand,
  useUpdateBrand,
} from '../hooks/use-brand'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const formSchema = z.object({
  name: z
    .string()
    .min(2, 'Informe pelo menos 2 caractéres')
    .max(60, 'Máximo 60 caractéres'),
})

export function BrandForm() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { data, isLoading } = useBrand(id ?? '')

  const createBrand = useCreateBrand()
  const updateBrand = useUpdateBrand()
  const deleteBrand = useDeleteBrand()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  })

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name,
      })
    }
  }, [data, form])

  function onSubmit(value: z.infer<typeof formSchema>) {
    if (id) {
      updateBrand.mutate(
        { id, brand: { name: value.name } },
        {
          onSettled: () => {
            navigate('/brands')
          },
        },
      )
    } else {
      createBrand.mutate(
        { name: value.name },
        {
          onSettled: () => {
            navigate('/brands')
          },
        },
      )
    }
  }

  function onDelete() {
    if (id) {
      deleteBrand.mutate(id, {
        onSettled: () => {
          navigate('/brands')
        },
      })
    }
  }

  return (
    <SidebarForm
      title={id ? 'Editar Marca' : 'Adicionar Marca'}
      onSave={form.handleSubmit(onSubmit)}
      {...(id && { onDelete: onDelete })}
      loading={isLoading}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Marca</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </SidebarForm>
  )
}
