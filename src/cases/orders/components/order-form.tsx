import { SidebarForm } from '@/components/layout/sidebar-form'
import { useNavigate, useParams } from 'react-router-dom'
import { useOrder } from '../hooks/use-order'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { OrderService } from '../services/order.service'
import { useQueryClient } from '@tanstack/react-query'

const formSchema = z.object({
  status: z.string(),
})

export function OrderForm() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { id } = useParams<{ id: string }>()
  const { data, isLoading } = useOrder(id ?? '')

  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: 'NEW',
    },
  })

  useEffect(() => {
    if (data) {
      form.reset({
        status: data.status ?? 'NEW',
      })
    }
  }, [data, form])

  async function onSave(values: z.infer<typeof formSchema>) {
    if (!id) {
      navigate('/orders')
      return
    }

    setLoading(true)
    try {
      await OrderService.update(id, { status: values.status })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['order', id] })
      navigate('/orders')
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error)
    } finally {
      setLoading(false)
    }
  }

  const statusOptions = [
    { value: 'NEW', label: 'Novo' },
    { value: 'SEPARATION', label: 'Separação' },
    { value: 'INVOICED', label: 'Faturado' },
    { value: 'SHIPPED', label: 'Enviado' },
    { value: 'DELIVERED', label: 'Entregue' },
    { value: 'CANCELED', label: 'Cancelado' },
  ]

  const subtotal =
    data?.items?.reduce((sum, item) => {
      const itemValue =
        typeof item.value === 'string' ? parseFloat(item.value) : item.value
      return sum + (itemValue ?? 0) * item.quantity
    }, 0) ?? 0

  return (
    <SidebarForm
      title={id ? 'Detalhes do Pedido' : 'Novo Pedido'}
      onSave={form.handleSubmit(onSave)}
      loading={loading || isLoading}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSave)}>
          <Tabs defaultValue="resumo">
            <TabsList>
              <TabsTrigger value="resumo">Resumo</TabsTrigger>
              <TabsTrigger value="cliente">Cliente</TabsTrigger>
              <TabsTrigger value="itens">Itens</TabsTrigger>
            </TabsList>

            <TabsContent
              value="resumo"
              className="space-y-4"
            >
              <div className="space-y-2">
                <FormLabel>ID do Pedido</FormLabel>
                <Input
                  value={data?.id ?? ''}
                  readOnly
                  className="bg-muted"
                />
              </div>

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Subtotal</FormLabel>
                <Input
                  value={`R$ ${subtotal.toFixed(2)}`}
                  readOnly
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <FormLabel>Frete</FormLabel>
                <Input
                  value={`R$ ${(typeof data?.shipping === 'string' ? parseFloat(data.shipping) : (data?.shipping ?? 0)).toFixed(2)}`}
                  readOnly
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <FormLabel>Total</FormLabel>
                <Input
                  value={`R$ ${(typeof data?.total === 'string' ? parseFloat(data.total) : (data?.total ?? 0)).toFixed(2)}`}
                  readOnly
                  className="bg-muted font-bold"
                />
              </div>

              <div className="space-y-2">
                <FormLabel>Data de Criação</FormLabel>
                <Input
                  value={
                    data?.createdAt
                      ? new Date(data.createdAt).toLocaleString('pt-BR')
                      : ''
                  }
                  readOnly
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <FormLabel>Última Atualização</FormLabel>
                <Input
                  value={
                    data?.updatedAt
                      ? new Date(data.updatedAt).toLocaleString('pt-BR')
                      : ''
                  }
                  readOnly
                  className="bg-muted"
                />
              </div>
            </TabsContent>

            <TabsContent
              value="cliente"
              className="space-y-4"
            >
              <div className="space-y-2">
                <FormLabel>Nome</FormLabel>
                <Input
                  value={data?.customer?.name ?? ''}
                  readOnly
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <FormLabel>Endereço</FormLabel>
                <Input
                  value={data?.customer?.address ?? ''}
                  readOnly
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <FormLabel>CEP</FormLabel>
                <Input
                  value={data?.customer?.zipcode ?? ''}
                  readOnly
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <FormLabel>Cidade</FormLabel>
                <Input
                  value={
                    data?.customer?.city
                      ? `${data.customer.city.name} - ${data.customer.city.state?.acronym}`
                      : ''
                  }
                  readOnly
                  className="bg-muted"
                />
              </div>
            </TabsContent>

            <TabsContent
              value="itens"
              className="space-y-4"
            >
              {data?.items?.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Nenhum item no pedido
                </p>
              ) : (
                data?.items?.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-4 border rounded-lg space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Item {index + 1}</h4>
                    </div>

                    <div className="space-y-2">
                      <FormLabel>Produto</FormLabel>
                      <Input
                        value={item.product?.name ?? ''}
                        readOnly
                        className="bg-muted"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <FormLabel>Quantidade</FormLabel>
                        <Input
                          value={item.quantity}
                          readOnly
                          className="bg-muted"
                        />
                      </div>

                      <div className="space-y-2">
                        <FormLabel>Valor Unitário</FormLabel>
                        <Input
                          value={`R$ ${(typeof item.value === 'string' ? parseFloat(item.value) : (item.value ?? 0)).toFixed(2)}`}
                          readOnly
                          className="bg-muted"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <FormLabel>Subtotal</FormLabel>
                      <Input
                        value={`R$ ${((typeof item.value === 'string' ? parseFloat(item.value) : (item.value ?? 0)) * item.quantity).toFixed(2)}`}
                        readOnly
                        className="bg-muted font-medium"
                      />
                    </div>
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </SidebarForm>
  )
}
