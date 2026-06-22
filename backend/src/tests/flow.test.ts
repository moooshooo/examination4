// backend/src/tests/flow.test.ts
import { describe, test, expect, beforeAll } from 'bun:test'

const BASE = process.env.TEST_BASE_URL ?? 'http://localhost:8015'

describe('Toads Delight — orderflöde', () => {
  let productId: string
  let orderId: string

  beforeAll(async () => {
    // Vänta tills API:et svarar (max 30s)
    for (let i = 0; i < 10; i++) {
      try {
        const res = await fetch(`${BASE}/api/products`)
        if (res.ok) return
      } catch {}
      await new Promise(r => setTimeout(r, 3000))
    }
    throw new Error('API svarade inte inom 30s')
  })

  test('GET /api/products returnerar menyn', async () => {
    const res = await fetch(`${BASE}/api/products`)
    expect(res.status).toBe(200)
    const products: any[] = await res.json()
    expect(Array.isArray(products)).toBe(true)
    expect(products.length).toBeGreaterThan(0)
    productId = products[0].id
  })

  test('POST /api/orders skapar en order med status placed', async () => {
    const res = await fetch(`${BASE}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerId: 'test-padda-ci',
        items: [{ productId, quantity: 1 }],
      }),
    })
    expect(res.status).toBe(201)
    const order: any = await res.json()
    expect(order.id).toBeDefined()
    expect(order.status).toBe('placed')
    orderId = order.id
  })

  test('GET /api/orders/:id hämtar order', async () => {
    const res = await fetch(`${BASE}/api/orders/${orderId}`)
    expect(res.status).toBe(200)
    const order: any = await res.json()
    expect(order.id).toBe(orderId)
    expect(order.customer_id).toBe('test-padda-ci')
  })
})
