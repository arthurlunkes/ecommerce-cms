import { DataTable } from '@/components/ui/data-table'
import { brandColumns } from './brand-columns'
import { useBrands } from '../../hooks/use-brand'

type BrandDataTableProps = {
  searchTerm?: string
}
export function BrandDataTable({ searchTerm }: BrandDataTableProps) {
  const { data: brands, isLoading } = useBrands()

  return (
    <div>
      {isLoading ? (
        <p>Carregando...</p>
      ) : (
        <DataTable
          columns={brandColumns}
          data={brands!.filter((p) =>
            p.name.toLowerCase().includes(searchTerm?.toLowerCase() ?? ''),
          )}
        />
      )}
    </div>
  )
}
