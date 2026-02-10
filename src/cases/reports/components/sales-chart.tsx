import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSalesByDate } from '../hooks/use-reports'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

export function SalesChart() {
  const { data, isLoading } = useSalesByDate()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vendas por Data</CardTitle>
        </CardHeader>
        <CardContent className="h-96 flex items-center justify-center">
          <p className="text-muted-foreground">Carregando...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendas por Data (Total e Quantidade de Pedidos)</CardTitle>
      </CardHeader>
      <CardContent className="h-96">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart data={data || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              stroke="#888888"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              yAxisId="left"
              stroke="#888888"
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#888888"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '4px',
              }}
              formatter={(value: any) => {
                if (typeof value === 'number') {
                  return value.toFixed(2)
                }
                return value
              }}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="totalValue"
              stroke="#3b82f6"
              name="Valor Total (R$)"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 4 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="orderCount"
              stroke="#10b981"
              name="Quantidade de Pedidos"
              strokeWidth={2}
              dot={{ fill: '#10b981', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
