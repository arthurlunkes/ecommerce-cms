import { useNavigate, useParams } from 'react-router-dom'
import { SidebarForm } from '@/components/layout/sidebar-form'
import { useEffect, useState } from 'react'
import {
  useProduct,
  useCreateProduct,
  useDeleteProduct,
  useUpdateProduct,
} from '../hooks/use-product'
import { Input } from '@/components/ui/input'
import type { ProductDTO } from '../dtos/product.dto'
import { Textarea } from '@/components/ui/textarea'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  FormControl,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useCategories } from '@/cases/categories/hooks/use-category'
import { useBrands } from '@/cases/brands/hooks/use-brand'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TabsContent } from '@radix-ui/react-tabs'

const formSchema = z.object({
  name: z
    .string()
    .min(2, 'Informe pelo menos 2 caracteres')
    .max(100, 'Máx. 100 caracteres'),
  description: z.string().optional(),
  price: z.coerce.number(),
  active: z.boolean(),
  categoryId: z.string().min(1, 'Selecione uma categoria'),
  brandId: z.string().optional(),
})

export function ProductForm() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { data, isLoading } = useProduct(id ?? '')

  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const deleteProduct = useDeleteProduct()

  const { data: categories = [] } = useCategories()
  const { data: brands = [] } = useBrands()

  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      active: true,
      categoryId: '',
      brandId: '',
    },
  })

  // Preenche o form ao editar
  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name ?? '',
        description: data.description ?? '',
        price: data.price ?? 0,
        active: data.active ?? true,
        categoryId: data.category?.id ?? '',
        brandId: data.brand?.id ?? '',
      })
    }
  }, [data, form])

  function handleDelete() {
    if (!id) return
    setLoading(true)
    deleteProduct.mutate(id, {
      onSettled: () => {
        navigate('/products')
        setLoading(false)
      },
    })
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)

    const payload: ProductDTO = {
      name: values.name,
      description: values.description,
      price: values.price,
      active: values.active,
      category: { id: values.categoryId, name: '' },
      brand: values.brandId ? { id: values.brandId, name: '' } : undefined,
    }

    if (id) {
      updateProduct.mutate(
        { id, product: payload },
        {
          onSettled: () => {
            navigate('/products')
            setLoading(false)
          },
        },
      )
    } else {
      createProduct.mutate(payload, {
        onSettled: () => {
          navigate('/products')
          setLoading(false)
        },
      })
    }
  }

  return (
    <SidebarForm
      title={id ? 'Editar Produto' : 'Novo Produto'}
      {...(id && { onDelete: handleDelete })}
      onSave={form.handleSubmit(onSubmit)}
      loading={loading || isLoading}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Tabs defaultValue="geral">
            <TabsList>
              <TabsTrigger value="geral">Geral</TabsTrigger>
              <TabsTrigger value="description">Descrição</TabsTrigger>
            </TabsList>
            <TabsContent
              value="geral"
              className="space-y-5"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nome do produto"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Categoria</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id || ''}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="brandId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marca</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione uma marca" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {brands.map((brand) => (
                          <SelectItem
                            key={brand.id}
                            value={brand.id || ''}
                          >
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Produto Ativo</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </TabsContent>
            <TabsContent
              value="description"
              className="space-y-5"
            >
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descrição do produto"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </SidebarForm>
  )
}
