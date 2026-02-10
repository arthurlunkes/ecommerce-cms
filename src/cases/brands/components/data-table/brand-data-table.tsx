import { DataTable } from '@/components/ui/data-table'
import { brandColumns } from './brand-columns'
import { useBrands } from '../../hooks/use-brand'

type BrandDataTableProps = {
  searchTerm?: string
}
export function BrandDataTable({ searchTerm }: BrandDataTableProps) {
  const { data: brands, isLoading } = useBrands()
  const rows = Array.isArray(brands) ? brands : []

  return (
    <div>
      {isLoading ? (
        <p>Carregando...</p>
      ) : (
        <DataTable
          columns={brandColumns}
          data={rows.filter((p) =>
            (p.name || '')
              .toLowerCase()
              .includes(searchTerm?.toLowerCase() ?? ''),
          )}
        />
      )}
    </div>
  )
}
