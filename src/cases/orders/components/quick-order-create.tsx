import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, ShoppingCart, Check, ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { CustomerService } from '@/cases/customers/services/customer.service'
import { ProductService } from '@/cases/products/services/product.service'
import { OrderService } from '../services/order.service'
import type { CustomerDTO } from '@/cases/customers/dtos/customer.dto'
import type { ProductDTO } from '@/cases/products/dtos/product.dto'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface OrderItemForm {
  product: ProductDTO | null
  quantity: number
}

const formatPrice = (price: number | string | undefined): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return (numPrice || 0).toFixed(2)
}

export function QuickOrderCreate() {
  const queryClient = useQueryClient()

  const [customerName, setCustomerName] = useState<string>('')
  const [openCustomerCombobox, setOpenCustomerCombobox] = useState(false)
  const [shipping, setShipping] = useState<number>(0)
  const [items, setItems] = useState<OrderItemForm[]>([
    { product: null, quantity: 1 },
  ])
  const [loading, setLoading] = useState(false)
  const [openComboboxes, setOpenComboboxes] = useState<Record<number, boolean>>(
    {},
  )

  const { data: customers = [] } = useQuery<CustomerDTO[]>({
    queryKey: ['customers'],
    queryFn: CustomerService.list,
  })

  const { data: products = [] } = useQuery<ProductDTO[]>({
    queryKey: ['products'],
    queryFn: ProductService.list,
  })

  const addItem = () => {
    setItems([...items, { product: null, quantity: 1 }])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (
    index: number,
    field: keyof OrderItemForm,
    value: ProductDTO | number | null,
  ) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => {
      if (item.product && item.quantity > 0) {
        const price =
          typeof item.product.price === 'string'
            ? parseFloat(item.product.price)
            : item.product.price
        return sum + (price || 0) * item.quantity
      }
      return sum
    }, 0)
  }

  const calculateTotal = () => {
    return calculateSubtotal() + (shipping || 0)
  }

  const handleSubmit = async () => {
    const validItems = items.filter((item) => item.product && item.quantity > 0)

    if (validItems.length === 0) {
      toast.error('Adicione pelo menos um produto ao pedido')
      return
    }

    setLoading(true)
    try {
      const orderData = {
        customer: customerName.trim() || null,
        shipping: shipping || 0,
        status: 'NEW',
        total: calculateTotal(),
        items: validItems.map((item) => ({
          product: item.product!,
          quantity: item.quantity,
          value:
            typeof item.product!.price === 'string'
              ? parseFloat(item.product!.price)
              : item.product!.price,
        })),
      }

      await OrderService.create(orderData)
      toast.success('Pedido criado com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      setItems([{ product: null, quantity: 1 }])
      setShipping(0)
      setCustomerName('')
      setOpenComboboxes({})
    } catch (error) {
      console.error('Erro ao criar pedido:', error)
      toast.error('Erro ao criar pedido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center justify-between sticky top-0 bg-white z-10">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          <h1 className="text-2xl font-bold">Pedido Rápido</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Esquerda - Formulário */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cliente */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">Cliente</h2>
              <Popover
                open={openCustomerCombobox}
                onOpenChange={setOpenCustomerCombobox}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openCustomerCombobox}
                    className="w-full justify-between"
                  >
                    {customerName ? (
                      <span className="truncate">{customerName}</span>
                    ) : (
                      <span className="text-muted-foreground">
                        Digite o nome do cliente (opcional)
                      </span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Digite ou busque um cliente..."
                      value={customerName}
                      onValueChange={setCustomerName}
                    />
                    <CommandList>
                      {customers.length === 0 ? (
                        <CommandEmpty>Nenhum cliente cadastrado.</CommandEmpty>
                      ) : (
                        <CommandGroup>
                          {customers
                            .filter((c) => !!c.id)
                            .map((customer) => (
                              <CommandItem
                                key={customer.id}
                                value={customer.name}
                                onSelect={(value) => {
                                  setCustomerName(value)
                                  setOpenCustomerCombobox(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    customerName === customer.name
                                      ? 'opacity-100'
                                      : 'opacity-0',
                                  )}
                                />
                                <div className="flex flex-col">
                                  <span>{customer.name}</span>
                                  {customer.city && (
                                    <span className="text-sm text-muted-foreground">
                                      {customer.city.name}
                                    </span>
                                  )}
                                </div>
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <p className="text-xs text-muted-foreground">
                Digite um nome diretamente ou selecione um cliente existente. Se
                o cliente não existir, será criado automaticamente.
              </p>
            </div>

            {/* Frete */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">Frete</h2>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={shipping}
                onChange={(e) => setShipping(parseFloat(e.target.value) || 0)}
                placeholder="Valor do frete (opcional)"
              />
            </div>

            {/* Produtos */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Produtos</h2>
                <Button
                  onClick={addItem}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Produto
                </Button>
              </div>

              {items.length === 0 ? (
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <p className="text-muted-foreground">
                    Nenhum produto adicionado
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Clique em "Adicionar Produto" para começar
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 space-y-4 bg-gray-50"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Produto {index + 1}</h3>
                        {items.length > 1 && (
                          <Button
                            onClick={() => removeItem(index)}
                            size="sm"
                            variant="ghost"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Produto</Label>
                          <Popover
                            open={openComboboxes[index]}
                            onOpenChange={(open: boolean) =>
                              setOpenComboboxes({
                                ...openComboboxes,
                                [index]: open,
                              })
                            }
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openComboboxes[index]}
                                className="w-full justify-between"
                              >
                                {item.product ? (
                                  <span className="truncate">
                                    {item.product.name} - R${' '}
                                    {formatPrice(item.product.price)}
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground">
                                    Selecione um produto...
                                  </span>
                                )}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[400px] p-0">
                              <Command>
                                <CommandInput placeholder="Buscar produto..." />
                                <CommandList>
                                  <CommandEmpty>
                                    Nenhum produto encontrado.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {products
                                      .filter((p) => !!p.id)
                                      .map((product) => (
                                        <CommandItem
                                          key={product.id}
                                          value={`${product.name} ${product.id}`}
                                          onSelect={() => {
                                            updateItem(
                                              index,
                                              'product',
                                              product,
                                            )
                                            setOpenComboboxes({
                                              ...openComboboxes,
                                              [index]: false,
                                            })
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              'mr-2 h-4 w-4',
                                              item.product?.id === product.id
                                                ? 'opacity-100'
                                                : 'opacity-0',
                                            )}
                                          />
                                          <div className="flex flex-col">
                                            <span>{product.name}</span>
                                            <span className="text-sm text-muted-foreground">
                                              R$ {formatPrice(product.price)}
                                            </span>
                                          </div>
                                        </CommandItem>
                                      ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div className="space-y-2">
                          <Label>Quantidade</Label>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(
                                index,
                                'quantity',
                                parseInt(e.target.value) || 1,
                              )
                            }
                          />
                        </div>
                      </div>

                      {item.product && (
                        <div className="bg-white p-3 rounded border">
                          <div className="flex justify-between text-sm">
                            <span>Preço unitário:</span>
                            <span className="font-medium">
                              R$ {formatPrice(item.product.price)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm font-bold mt-2 text-primary">
                            <span>Subtotal:</span>
                            <span>
                              R${' '}
                              {formatPrice(
                                (typeof item.product.price === 'string'
                                  ? parseFloat(item.product.price)
                                  : item.product.price) * item.quantity,
                              )}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Direita - Resumo */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 border rounded-lg p-4 bg-gray-50 space-y-4">
              <h2 className="text-lg font-semibold">Resumo do Pedido</h2>

              <div className="space-y-2 border-b pb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-medium">
                    R$ {formatPrice(calculateSubtotal())}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Frete:</span>
                  <span className="font-medium">
                    R$ {formatPrice(shipping || 0)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between">
                <span className="font-bold">Total:</span>
                <span className="text-xl font-bold text-primary">
                  R$ {formatPrice(calculateTotal())}
                </span>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={
                  loading ||
                  items.filter((item) => item.product && item.quantity > 0)
                    .length === 0
                }
                className="w-full"
                size="lg"
              >
                {loading ? 'Criando...' : 'Criar Pedido'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
