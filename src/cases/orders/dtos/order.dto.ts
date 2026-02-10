import type { CustomerDTO } from '@/cases/customers/dtos/customer.dto'
import type { ProductDTO } from '@/cases/products/dtos/product.dto'

export interface OrderItemDTO {
  id?: string
  product: ProductDTO
  quantity: number
  value: number
}
export interface OrderDTO {
  id?: string
  customer: CustomerDTO | string | null
  shipping: number
  status: string
  total: number
  items: OrderItemDTO[]
  createdAt: Date
  updatedAt: Date
}
