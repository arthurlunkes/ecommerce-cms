import { useOrderStats } from '../hooks/use-reports'
import { StatCard } from '../components/stat-card'
import { SalesChart } from '../components/sales-chart'
import { TopCategoriesChart } from '../components/top-categories-chart'
import { TopProductsTable } from '../components/top-products-table'
import { AllSalesTable } from '../components/all-sales-table'

export function ReportsPage() {
  const { data: stats, isLoading } = useOrderStats()

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
        <p className="text-muted-foreground mt-2">
          Dashboard com análise completa de vendas, produtos e categorias
        </p>
      </div>

      {/* Estatísticas Resumidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total de Pedidos"
          value={
            isLoading ? '...' : stats?.totalOrders.toLocaleString('pt-BR') || 0
          }
          subtitle={
            stats?.dateRange
              ? `De ${new Date(stats.dateRange.from).toLocaleDateString('pt-BR')} até ${new Date(stats.dateRange.to).toLocaleDateString('pt-BR')}`
              : 'Nenhum pedido'
          }
        />

        <StatCard
          title="Receita Total"
          value={
            isLoading
              ? '...'
              : `R$ ${(stats?.totalRevenue || 0).toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
          }
          subtitle="Valor total de todos os pedidos"
        />

        <StatCard
          title="Ticket Médio"
          value={
            isLoading
              ? '...'
              : `R$ ${(stats?.averageOrderValue || 0).toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
          }
          subtitle="Valor médio por pedido"
        />

        <StatCard
          title="Período"
          value={stats?.dateRange ? 'Ativo' : 'Sem dados'}
          subtitle={
            stats?.dateRange
              ? `${Math.ceil(
                  (new Date(stats.dateRange.to).getTime() -
                    new Date(stats.dateRange.from).getTime()) /
                    (1000 * 60 * 60 * 24),
                )} dias`
              : 'Nenhum pedido registrado'
          }
        />
      </div>

      {/* Gráfico de Vendas por Data */}
      <SalesChart />

      {/* Gráfico de Categorias */}
      <TopCategoriesChart />

      {/* Tabela de Produtos */}
      <TopProductsTable />

      {/* Tabela de Todas as Vendas */}
      <AllSalesTable />
    </div>
  )
}
