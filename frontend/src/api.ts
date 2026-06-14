// frontend/src/api.ts
const BASE = (import.meta.env.VITE_API_URL ?? '/api') as string

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: 'food' | 'drink'
  available: boolean
}

export interface Order {
  id: string
  customer_id: string
  status: string
  created_at: string
}

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE}/v1/products`)
  if (!res.ok) throw new Error('Kunde inte ladda menyn')
  return res.json()
}

export async function placeOrder(data: {
  customerId: string
  items: { productId: string; quantity: number }[]
}): Promise<Order> {
  const res = await fetch(`${BASE}/v1/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Ordern misslyckades')
  return res.json()
}

export async function getOrder(id: string): Promise<Order> {
  const res = await fetch(`${BASE}/v1/orders/${id}`)
  if (!res.ok) throw new Error('Hittade inte ordern')
  return res.json()
}

export async function getActiveOrders(): Promise<Order[]> {
  const res = await fetch(`${BASE}/v1/orders/active`)
  if (!res.ok) throw new Error('Kunde inte hämta aktiva ordrar')
  return res.json()
}
