import { DataTable } from '@/components/ui/data-table'
import { orderColumns } from './order-columns'
import { useOrders } from '../../hooks/use-order'

type OrderDataTableProps = {
  searchTerm?: string
}
export function OrderDataTable({ searchTerm }: OrderDataTableProps) {
  const { data: orders, isLoading } = useOrders()
  const rows = Array.isArray(orders) ? orders : []

  return (
    <div>
      {isLoading ? (
        <p>Carregando...</p>
      ) : (
        <DataTable
          columns={orderColumns}
          data={rows.filter((o) => {
            const search = searchTerm?.toLowerCase() ?? ''
            return (
              (o.status || '').toLowerCase().includes(search) ||
              (o.customer?.name || '').toLowerCase().includes(search) ||
              (o.id || '').toLowerCase().includes(search)
            )
          })}
        />
      )}
    </div>
  )
}
