import { BreadCrumb } from '@/components/layout/bread-crumb'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Search, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { OrderDataTable } from './data-table/order-data-table'

export function OrderLayout() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  function handleQuickOrder() {
    navigate('/orders/quick')
  }

  return (
    <div className="p-4">
      <BreadCrumb title="Pedidos" />

      <div className="flex flex-col py-4 gap-4">
        <div className="flex flex-row justify-end gap-4 my-4">
          <InputGroup className="max-w-96">
            <InputGroupInput
              placeholder="Procurar por cliente ou status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>
          <Button
            onClick={handleQuickOrder}
            variant="default"
          >
            <Zap className="mr-2 h-4 w-4" />
            Criar Pedido Rápido
          </Button>
        </div>

        <div>
          <OrderDataTable searchTerm={searchTerm} />
          <Outlet />
        </div>
      </div>
    </div>
  )
}
