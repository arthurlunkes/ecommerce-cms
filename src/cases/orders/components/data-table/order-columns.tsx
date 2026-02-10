import type { ColumnDef } from '@tanstack/react-table'
import type { OrderDTO } from '../../dtos/order.dto'
import { DataTableAction } from '@/components/layout/data-table-actions'
import { DeleteOrderButton } from '../delete-order-button'

export const orderColumns: ColumnDef<OrderDTO>[] = [
  {
    accessorKey: 'customer',
    header: 'Cliente',
    cell: ({ row }) => {
      const customer = row.original.customer
      return customer?.name || 'Sem cliente'
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const value = getValue<string>()
      const statusMap: Record<string, { label: string; color: string }> = {
        NEW: { label: 'Novo', color: 'text-blue-600' },
        SEPARATION: { label: 'Separação', color: 'text-yellow-600' },
        INVOICED: { label: 'Faturado', color: 'text-purple-600' },
        SHIPPED: { label: 'Enviado', color: 'text-orange-600' },
        DELIVERED: { label: 'Entregue', color: 'text-green-600' },
        CANCELED: { label: 'Cancelado', color: 'text-red-600' },
      }
      const status = statusMap[value] || { label: value, color: '' }
      return <span className={status.color}>{status.label}</span>
    },
  },
  {
    accessorKey: 'shipping',
    header: 'Frete',
    cell: ({ getValue }) => {
      const value = getValue<string | number>()
      const numValue = typeof value === 'string' ? parseFloat(value) : value
      return `R$ ${(numValue ?? 0).toFixed(2)}`
    },
  },
  {
    accessorKey: 'total',
    header: 'Total',
    cell: ({ getValue }) => {
      const value = getValue<string | number>()
      const numValue = typeof value === 'string' ? parseFloat(value) : value
      return `R$ ${(numValue ?? 0).toFixed(2)}`
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Data',
    cell: ({ getValue }) => {
      const value = getValue<Date>()
      return new Date(value).toLocaleDateString('pt-BR')
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const order = row.original

      return (
        <div className="flex justify-end gap-2 mr-4">
          <DataTableAction itemId={order.id!} />
          <DeleteOrderButton orderId={order.id!} />
        </div>
      )
    },
  },
]
