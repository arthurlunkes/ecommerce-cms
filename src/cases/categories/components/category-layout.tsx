import { BreadCrumb } from '@/components/layout/bread-crumb'
import { CategoryDataTable } from './data-table/category-data-table'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Outlet, useNavigate } from 'react-router-dom'

export function CategoryLayout() {
  const navigate = useNavigate()

  function handleCreate() {
    navigate('/categories/new')
  }

  return (
    <div className="p-4">
      <BreadCrumb title="Categorias" />

      <div className="flex flex-col py-4 gap-4">
        <div className="flex flex-row justify-end gap-4 my-4">
          <InputGroup className="max-w-96">
            <InputGroupInput placeholder="Search..." />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>
          <Button onClick={handleCreate}>
            <Plus />
            Adicionar
          </Button>
        </div>

        <div>
          <CategoryDataTable />
          <Outlet />
        </div>
      </div>
    </div>
  )
}
