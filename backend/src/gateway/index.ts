// src/gateway/index.ts
import { createServer } from '../shared/createServer'

const app = createServer('gateway')
const PORT = Number(process.env.PORT) || 3000

const PRODUCT_SVC = process.env.PRODUCT_SERVICE_URL ?? 'http://product-service:3001'
const ORDER_SVC   = process.env.ORDER_SERVICE_URL   ?? 'http://order-service:3002'

async function proxy(res: Response, reply: any) {
  const body = await res.json()
  return reply.code(res.status).send(body)
}

// ── Products ─────────────────────────────────────────────────────────────────
app.get('/api/v1/products', async (_, reply) =>
  proxy(await fetch(`${PRODUCT_SVC}/api/v1/products`), reply)
)

app.get<{ Params: { id: string } }>('/api/v1/products/:id', async (req, reply) =>
  proxy(await fetch(`${PRODUCT_SVC}/api/v1/products/${req.params.id}`), reply)
)

// ── Orders ────────────────────────────────────────────────────────────────────
app.post('/api/v1/orders', async (req, reply) =>
  proxy(
    await fetch(`${ORDER_SVC}/api/v1/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    }),
    reply
  )
)

app.get<{ Params: { id: string } }>('/api/v1/orders/:id', async (req, reply) =>
  proxy(await fetch(`${ORDER_SVC}/api/v1/orders/${req.params.id}`), reply)
)

app.listen({ host: '0.0.0.0', port: PORT }, (err) => {
  if (err) { app.log.error(err); process.exit(1) }
})
