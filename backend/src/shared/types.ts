export interface OrderItem {
  productId: string
  quantity: number
}

export interface CreateOrder {
  customerId: string
  items: OrderItem[]
}

export type OrderStatus = 'placed' | 'cooking' | 'ready'

export const QUEUES = {
  ORDER_PLACED: 'order_placed',
  ORDER_READY: 'order_ready',
} as const
