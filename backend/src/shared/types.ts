// src/shared/types.ts
import { z } from 'zod'

export const OrderItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
})

export const CreateOrderSchema = z.object({
  customerId: z.string(),
  items: z.array(OrderItemSchema).min(1),
})

export type CreateOrder = z.infer<typeof CreateOrderSchema>

export type OrderStatus = 'placed' | 'cooking' | 'ready'

export const QUEUES = {
  ORDER_PLACED: 'order_placed',
  ORDER_READY: 'order_ready',
} as const
