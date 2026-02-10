import type { ColumnDef } from '@tanstack/react-table'
import type { CustomerDTO } from '../../dtos/customer.dto'
import { DataTableAction } from '@/components/layout/data-table-actions'

export const customerColumns: ColumnDef<CustomerDTO>[] = [
  {
    accessorKey: 'name',
    header: 'Nome do Cliente',
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const customer = row.original

      return (
        <div className="flex justify-end mr-4">
          <DataTableAction itemId={customer.id!} />
        </div>
      )
    },
  },
]
