import { BreadCrumb } from '@/components/layout/bread-crumb'
import { ProductDataTable } from './data-table/product-data-table'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Outlet, useNavigate } from 'react-router-dom'

export function ProductLayout() {
  const navigate = useNavigate()

  function handleCreate() {
    navigate('/products/new')
  }

  return (
    <div className="p-4">
      <BreadCrumb title="Marcas" />

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
          <ProductDataTable />
          <Outlet />
        </div>
      </div>
    </div>
  )
}
