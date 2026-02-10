import { DataTable } from '@/components/ui/data-table'
import { customerColumns } from './customer-columns'
import { useCustomers } from '../../hooks/use-customer'

type CustomerDataTableProps = {
  searchTerm?: string
}
export function CustomerDataTable({ searchTerm }: CustomerDataTableProps) {
  const { data: customers, isLoading } = useCustomers()
  const rows = Array.isArray(customers) ? customers : []

  return (
    <div>
      {isLoading ? (
        <p>Carregando...</p>
      ) : (
        <DataTable
          columns={customerColumns}
          data={rows.filter((c) =>
            (c.name || '')
              .toLowerCase()
              .includes(searchTerm?.toLowerCase() ?? ''),
          )}
        />
      )}
    </div>
  )
}
