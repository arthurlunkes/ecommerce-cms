import { SidebarForm } from '@/components/layout/sidebar-form'
import { useNavigate, useParams } from 'react-router-dom'
import {
  useCustomer,
  useCreateCustomer,
  useDeleteCustomer,
  useUpdateCustomer,
} from '../hooks/use-customer'
import { useCities } from '@/cases/cities/hooks/use-city'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { CustomerDTO } from '../dtos/customer.dto'

const formSchema = z.object({
  name: z
    .string()
    .min(2, 'Informe pelo menos 2 caractéres')
    .max(60, 'Máximo 60 caractéres'),
  address: z.string().optional(),
  zipcode: z.string().optional(),
  cityId: z.string().min(1, 'Selecione uma cidade'),
})

export function CustomerForm() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { data, isLoading } = useCustomer(id ?? '')
  const { data: cities = [] } = useCities()

  const createCustomer = useCreateCustomer()
  const updateCustomer = useUpdateCustomer()
  const deleteCustomer = useDeleteCustomer()

  const [loading, setLoading] = useState(false)
  const [citySearch, setCitySearch] = useState('')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      address: '',
      zipcode: '',
      cityId: '',
    },
  })

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name ?? '',
        address: data.address ?? '',
        zipcode: data.zipcode ?? '',
        cityId: data.city?.id ?? '',
      })
    }
  }, [data, form])

  function handleDelete() {
    if (!id) return
    setLoading(true)
    deleteCustomer.mutate(id, {
      onSettled: () => {
        navigate('/customers')
        setLoading(false)
      },
    })
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)

    const city = cities.find((item) => item.id === values.cityId)

    if (!city) {
      form.setError('cityId', {
        type: 'manual',
        message: 'Selecione uma cidade valida',
      })
      setLoading(false)
      return
    }

    const payload: CustomerDTO = {
      name: values.name,
      address: values.address ?? '',
      zipcode: values.zipcode ?? '',
      city,
    }

    if (id) {
      updateCustomer.mutate(
        { id, customer: payload },
        {
          onSettled: () => {
            navigate('/customers')
            setLoading(false)
          },
        },
      )
    } else {
      createCustomer.mutate(payload, {
        onSettled: () => {
          navigate('/customers')
          setLoading(false)
        },
      })
    }
  }

  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(citySearch.toLowerCase()),
  )

  return (
    <SidebarForm
      title={id ? 'Editar Cliente' : 'Adicionar Cliente'}
      {...(id && { onDelete: handleDelete })}
      onSave={form.handleSubmit(onSubmit)}
      loading={loading || isLoading}
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
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endereço</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="zipcode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CEP</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cityId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cidade</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <Input
                      value={citySearch}
                      onChange={(event) => setCitySearch(event.target.value)}
                      placeholder="Buscar cidade..."
                    />
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma cidade" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredCities.length === 0 ? (
                          <SelectItem
                            value="__no-results"
                            disabled
                          >
                            Nenhuma cidade encontrada
                          </SelectItem>
                        ) : (
                          filteredCities
                            .filter((c) => !!c.id)
                            .map((city) => (
                              <SelectItem
                                key={city.id}
                                value={city.id!}
                              >
                                {city.name} - {city.state?.acronym}
                              </SelectItem>
                            ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
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
