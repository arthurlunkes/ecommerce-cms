import { BreadCrumb } from '@/components/layout/bread-crumb'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { CustomerDataTable } from './data-table/customer-data-table'

export function CustomerLayout() {
  const navigate = useNavigate()

  const [searchTerm, setSearchTerm] = useState('')

  function handleCreate() {
    navigate('/customers/new')
  }

  return (
    <div className="p-4">
      <BreadCrumb title="Clientes" />

      <div className="flex flex-col py-4 gap-4">
        <div className="flex flex-row justify-end gap-4 my-4">
          <InputGroup className="max-w-96">
            <InputGroupInput
              placeholder="Procurar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
          <CustomerDataTable searchTerm={searchTerm} />
          <Outlet />
        </div>
      </div>
    </div>
  )
}
