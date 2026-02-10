import { useQuery } from '@tanstack/react-query'
import {
  reportsService,
  type SalesByDate,
  type TopCategory,
  type TopProduct,
  type OrderStats,
  type OrderItem,
} from '../services/reports.service'

export function useSalesByDate() {
  return useQuery<SalesByDate[]>({
    queryKey: ['reports', 'sales-by-date'],
    queryFn: () => reportsService.getSalesByDate(),
  })
}

export function useTopCategories(limit: number = 10) {
  return useQuery<TopCategory[]>({
    queryKey: ['reports', 'top-categories', limit],
    queryFn: () => reportsService.getTopCategories(limit),
  })
}

export function useTopProducts(limit: number = 10) {
  return useQuery<TopProduct[]>({
    queryKey: ['reports', 'top-products', limit],
    queryFn: () => reportsService.getTopProducts(limit),
  })
}

export function useOrderStats() {
  return useQuery<OrderStats>({
    queryKey: ['reports', 'order-stats'],
    queryFn: () => reportsService.getOrderStats(),
  })
}

export function useAllOrders() {
  return useQuery<OrderItem[]>({
    queryKey: ['reports', 'all-orders'],
    queryFn: () => reportsService.getAllOrders(),
  })
}
