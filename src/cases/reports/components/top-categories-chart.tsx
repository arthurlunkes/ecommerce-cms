import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTopCategories } from '../hooks/use-reports'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

export function TopCategoriesChart() {
  const { data, isLoading } = useTopCategories(10)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Categorias Mais Vendidas</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <p className="text-muted-foreground">Carregando...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 10 Categorias Mais Vendidas</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart data={data || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="categoryName"
              stroke="#888888"
              angle={-45}
              textAnchor="end"
              height={100}
              style={{ fontSize: '12px' }}
            />
            <YAxis
              yAxisId="left"
              stroke="#888888"
              label={{
                value: 'Quantidade',
                angle: -90,
                position: 'insideLeft',
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#888888"
              label={{
                value: 'Valor Total (R$)',
                angle: 90,
                position: 'insideRight',
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '4px',
              }}
              formatter={(value: any) => {
                if (typeof value === 'number') {
                  if (value > 100) {
                    return `R$ ${value.toFixed(2)}`
                  }
                  return value
                }
                return value
              }}
            />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="quantity"
              fill="#8b5cf6"
              name="Quantidade de Itens"
            />
            <Bar
              yAxisId="right"
              dataKey="totalValue"
              fill="#06b6d4"
              name="Valor Total (R$)"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
