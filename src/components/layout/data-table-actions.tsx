import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { EditIcon } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

type DataTableActionProps = {
  itemId: string | number
}
export function DataTableAction({ itemId }: DataTableActionProps) {
  const location = useLocation()
  const navigate = useNavigate()

  function handleNavigateToId() {
    const path = location.pathname
    navigate(`${path}/${itemId}`)
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNavigateToId}
        >
          <EditIcon />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Editar/remover registro</p>
      </TooltipContent>
    </Tooltip>
  )
}
