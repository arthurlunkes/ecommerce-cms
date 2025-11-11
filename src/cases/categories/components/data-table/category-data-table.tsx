import { DataTable } from '@/components/ui/data-table'
import { categoryColumns } from './category-columns'
import { useCategories } from '../../hooks/use-category'

type CategoryDataTableProps = {
  searchTerm?: string
}
export function CategoryDataTable({ searchTerm }: CategoryDataTableProps) {
  const { data: categories, isLoading } = useCategories()

  return (
    <div>
      {isLoading ? (
        <p>Carregando...</p>
      ) : (
        <DataTable
          columns={categoryColumns}
          data={categories!.filter((p) =>
            p.name.toLowerCase().includes(searchTerm?.toLowerCase() ?? ''),
          )}
        />
      )}
    </div>
  )
}
