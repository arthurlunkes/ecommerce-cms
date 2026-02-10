import { useState } from 'react'
import { useAllOrders } from '../hooks/use-reports'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Download, Loader2, Trash2 } from 'lucide-react'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { OrderService } from '@/cases/orders/services/order.service'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export function AllSalesTable() {
  const { data: orders, isLoading } = useAllOrders()
  const [sortBy, setSortBy] = useState<'date' | 'price'>('date')
  const queryClient = useQueryClient()

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await OrderService.delete(orderId)
      toast.success('Pedido excluído com sucesso!')

      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['reports'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    } catch (error) {
      console.error('Erro ao excluir pedido:', error)
      toast.error('Erro ao excluir pedido. Tente novamente.')
    }
  }

  const sortedOrders = orders
    ? [...orders].sort((a, b) => {
        if (sortBy === 'date') {
          return (
            new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
          )
        }
        return b.totalPrice - a.totalPrice
      })
    : []

  // Agrupar por pedido para renderizar botão de delete apenas uma vez por pedido
  const orderIdsRendered = new Set<string>()

  const totalRevenue =
    orders?.reduce((sum, order) => sum + order.totalPrice, 0) || 0
  const totalItems =
    orders?.reduce((sum, order) => sum + order.quantity, 0) || 0

  const exportToPDF = () => {
    if (!orders || orders.length === 0) return

    const doc = new jsPDF()
    const timestamp = new Date().toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })

    // Título
    doc.setFontSize(16)
    doc.text('Relatório de Vendas Detalhadas', 14, 15)
    doc.setFontSize(10)
    doc.text(`Gerado em: ${timestamp}`, 14, 22)

    // Resumo
    doc.setFontSize(11)
    doc.text(`Total de Itens Vendidos: ${totalItems}`, 14, 35)
    doc.text(
      `Receita Total: R$ ${totalRevenue.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
      })}`,
      14,
      42,
    )

    // Tabela
    const tableData = sortedOrders.map((order) => [
      new Date(order.orderDate).toLocaleDateString('pt-BR'),
      order.orderId.substring(0, 8),
      order.productName,
      order.quantity.toString(),
      `R$ ${order.unitPrice.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
      })}`,
      `R$ ${order.totalPrice.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
      })}`,
    ])

    autoTable(doc, {
      head: [['Data', 'Pedido', 'Produto', 'Qtd', 'Preço Unit.', 'Total']],
      body: tableData,
      startY: 50,
      didDrawPage: function () {
        const pageSize = doc.internal.pageSize
        const pageHeight = pageSize.getHeight()
        const pageWidth = pageSize.getWidth()
        const pageCount = doc.getNumberOfPages()

        // Rodapé
        doc.setFontSize(8)
        doc.text(`Página ${pageCount}`, pageWidth / 2, pageHeight - 10, {
          align: 'center',
        })
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [242, 242, 242],
      },
    })

    doc.save(`relatório_vendas_${new Date().getTime()}.pdf`)
  }

  if (isLoading) {
    return (
      <div className="space-y-4 rounded-lg border p-6">
        <h2 className="text-2xl font-bold">Todas as Vendas</h2>
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 rounded-lg border p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Todas as Vendas</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Total de {orders?.length || 0} itens vendidos
          </p>
        </div>
        <Button
          onClick={exportToPDF}
          disabled={!orders || orders.length === 0}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Exportar PDF
        </Button>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg bg-blue-50 p-4">
          <p className="text-sm text-muted-foreground">Total de Itens</p>
          <p className="text-2xl font-bold text-blue-600">{totalItems}</p>
        </div>
        <div className="rounded-lg bg-green-50 p-4">
          <p className="text-sm text-muted-foreground">Receita Total</p>
          <p className="text-2xl font-bold text-green-600">
            R${' '}
            {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="rounded-lg bg-purple-50 p-4">
          <p className="text-sm text-muted-foreground">Preço Médio</p>
          <p className="text-2xl font-bold text-purple-600">
            R${' '}
            {(totalRevenue / (totalItems || 1)).toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>

      {/* Controles de Ordenação */}
      <div className="flex gap-2">
        <Button
          variant={sortBy === 'date' ? 'default' : 'outline'}
          onClick={() => setSortBy('date')}
          size="sm"
        >
          Ordenar por Data
        </Button>
        <Button
          variant={sortBy === 'price' ? 'default' : 'outline'}
          onClick={() => setSortBy('price')}
          size="sm"
        >
          Ordenar por Valor
        </Button>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>ID Pedido</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead className="text-right">Quantidade</TableHead>
              <TableHead className="text-right">Preço Unit.</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedOrders && sortedOrders.length > 0 ? (
              sortedOrders.map((order) => {
                const showDeleteButton = !orderIdsRendered.has(order.orderId)
                if (showDeleteButton) {
                  orderIdsRendered.add(order.orderId)
                }

                return (
                  <TableRow key={`${order.orderId}-${order.productId}`}>
                    <TableCell>
                      {new Date(order.orderDate).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {order.orderId.substring(0, 12)}...
                    </TableCell>
                    <TableCell className="font-medium">
                      {order.productName}
                    </TableCell>
                    <TableCell className="text-right">
                      {order.quantity}
                    </TableCell>
                    <TableCell className="text-right">
                      R${' '}
                      {order.unitPrice.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      R${' '}
                      {order.totalPrice.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell className="text-sm">
                      {order.customerName}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-green-100 text-green-800">
                        {order.status === 'completed'
                          ? 'Entregue'
                          : order.status === 'pending'
                            ? 'Pendente'
                            : order.status === 'processing'
                              ? 'Processando'
                              : order.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {showDeleteButton && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Confirmar exclusão
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir este pedido? Esta
                                ação não pode ser desfeita. Todos os itens do
                                pedido também serão removidos.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteOrder(order.orderId)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center py-8"
                >
                  <p className="text-muted-foreground">
                    Nenhuma venda encontrada
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
