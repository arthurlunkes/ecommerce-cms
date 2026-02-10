import { api } from '@/lib/axios'

export interface SalesByDate {
  date: string
  orderCount: number
  totalValue: number
  averageOrderValue: number
}

export interface TopCategory {
  categoryId: string
  categoryName: string
  quantity: number
  totalValue: number
}

export interface TopProduct {
  productId: string
  productName: string
  quantity: number
  totalValue: number
}

export interface OrderStats {
  totalOrders: number
  totalRevenue: number
  averageOrderValue: number
  dateRange: {
    from: string
    to: string
  }
}

export interface OrderItem {
  orderId: string
  orderDate: string
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  totalPrice: number
  customerName: string
  customerEmail: string
  status: string
}

export const reportsService = {
  async getSalesByDate(): Promise<SalesByDate[]> {
    const response = await api.get('/orders/stats/by-date')
    return response.data
  },

  async getTopCategories(limit: number = 10): Promise<TopCategory[]> {
    const response = await api.get('/orders/stats/top-categories', {
      params: { limit },
    })
    return response.data
  },

  async getTopProducts(limit: number = 10): Promise<TopProduct[]> {
    const response = await api.get('/orders/stats/top-products', {
      params: { limit },
    })
    return response.data
  },

  async getOrderStats(): Promise<OrderStats> {
    const response = await api.get('/orders/stats/summary')
    return response.data
  },

  async getAllOrders(): Promise<OrderItem[]> {
    const response = await api.get('/orders/all-details')
    return response.data
  },
}
