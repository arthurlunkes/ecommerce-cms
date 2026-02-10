import { type ColumnDef } from '@tanstack/react-table'
import type { ProductDTO } from '../../dtos/product.dto'
import { cn } from '@/lib/utils'
import { DataTableAction } from '@/components/layout/data-table-actions'
import { FormattedNumber, IntlProvider } from 'react-intl'

export const productColumns: ColumnDef<ProductDTO>[] = [
  {
    accessorKey: 'name',
    header: 'Nome',
    cell: ({ row }) => {
      const product = row.original
      return (
        <p className={!product.active ? 'text-gray-300' : ''}>{product.name}</p>
      )
    },
  },
  {
    accessorKey: 'category.name',
    header: 'Categoria',
    cell: ({ row }) => {
      const product = row.original
      return (
        <p className={!product.active ? 'text-gray-300' : ''}>
          {product.category?.name}
        </p>
      )
    },
  },
  {
    accessorKey: 'brand.name',
    header: 'Marca',
    cell: ({ row }) => {
      const product = row.original
      return (
        <p className={!product.active ? 'text-gray-300' : ''}>
          {product.brand?.name}
        </p>
      )
    },
  },
  {
    accessorKey: 'price',
    header: 'Preço',
    cell: ({ row }) => {
      const product = row.original
      return (
        <p className={!product.active ? 'text-gray-300' : ''}>
          <IntlProvider locale="pt-BR">
            <FormattedNumber
              value={product.price!}
              style="currency"
              currency="BRL"
            />
          </IntlProvider>
        </p>
      )
    },
  },
  {
    accessorKey: 'active',
    header: 'Ativo',
    cell: ({ row }) => {
      const product = row.original
      return (
        <div
          className={cn(
            'w-4 h-4 rounded-full',
            product.active ? 'bg-green-500' : 'bg-gray-300',
          )}
        ></div>
      )
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const product = row.original
      return (
        <div className="flex justify-end mr-4">
          <DataTableAction itemId={product.id!} />
        </div>
      )
    },
  },
]
