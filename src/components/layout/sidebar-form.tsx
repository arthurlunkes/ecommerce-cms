import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '../ui/button'
import { useLocation, useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Trash2 } from 'lucide-react'

type SidebarFormProps = {
  title: string
  children: ReactNode
  onSave?: () => void
  onDelete?: () => void
  loading: boolean
}
export function SidebarForm({
  title,
  children,
  onSave,
  onDelete,
  loading,
}: SidebarFormProps) {
  const navigate = useNavigate()
  const location = useLocation()

  function handleCloseForm(open: boolean) {
    if (!open) {
      const currentPath = location.pathname
      const newPath = currentPath.substring(0, currentPath.lastIndexOf('/'))
      navigate(newPath)
    }
  }

  return (
    <Sheet
      open={true}
      onOpenChange={handleCloseForm}
    >
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>
            Preencha os campos abaixo e clique em Salvar.
          </SheetDescription>
        </SheetHeader>

        <div className="px-8">{children}</div>

        <SheetFooter className="flex flex-row justify-between">
          <div className="flex flex-row gap-1">
            <Button
              type="button"
              onClick={onSave}
              disabled={loading}
            >
              Salvar
            </Button>

            <SheetClose asChild>
              <Button
                variant="outline"
                disabled={loading}
              >
                Cancelar
              </Button>
            </SheetClose>
          </div>
          {onDelete && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={onDelete}
                >
                  <Trash2 />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Remover o registro</p>
              </TooltipContent>
            </Tooltip>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
