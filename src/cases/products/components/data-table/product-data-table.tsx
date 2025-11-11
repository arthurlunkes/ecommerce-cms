import { DataTable } from '@/components/ui/data-table'
import { productColumns } from './product-columns'
import { useProducts } from '../../hooks/use-product'

type ProductDataTableProps = {
  searchTerm?: string
}
export function ProductDataTable({ searchTerm }: ProductDataTableProps) {
  const { data: products, isLoading } = useProducts()

  return (
    <div>
      {isLoading ? (
        <p>Carregando...</p>
      ) : (
        <DataTable
          columns={productColumns}
          data={products!.filter((p) =>
            p.name.toLowerCase().includes(searchTerm?.toLowerCase() ?? ''),
          )}
        />
      )}
    </div>
  )
}
