// backend/src/tests/schema.test.ts
import { describe, test, expect } from 'bun:test'
import { CreateOrderSchema } from '../shared/types'

describe('CreateOrderSchema', () => {
  test('accepterar giltig order', () => {
    const result = CreateOrderSchema.safeParse({
      customerId: 'padda-123',
      items: [{ productId: '550e8400-e29b-41d4-a716-446655440000', quantity: 2 }],
    })
    expect(result.success).toBe(true)
  })

  test('avvisar tom items-lista', () => {
    const result = CreateOrderSchema.safeParse({
      customerId: 'padda-123',
      items: [],
    })
    expect(result.success).toBe(false)
  })

  test('avvisar ogiltigt productId (inte UUID)', () => {
    const result = CreateOrderSchema.safeParse({
      customerId: 'padda-123',
      items: [{ productId: 'inte-ett-uuid', quantity: 1 }],
    })
    expect(result.success).toBe(false)
  })

  test('avvisar negativ quantity', () => {
    const result = CreateOrderSchema.safeParse({
      customerId: 'padda-123',
      items: [{ productId: '550e8400-e29b-41d4-a716-446655440000', quantity: -1 }],
    })
    expect(result.success).toBe(false)
  })
})
