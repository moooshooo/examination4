// src/order-service/index.ts
import { createServer } from '../shared/createServer'
import { OrderRepository } from './repository'
import { connectRabbitMQ, publish } from '../shared/rabbitmq'
import { CreateOrderSchema, QUEUES, type CreateOrder } from '../shared/types'

const app = createServer('order-service')
const repo = new OrderRepository()
const PORT = Number(process.env.PORT) || 3002

let channel: Awaited<ReturnType<typeof connectRabbitMQ>>

app.post('/api/v1/orders', async (req, reply) => {
  const result = CreateOrderSchema.safeParse(req.body)
  if (!result.success) return reply.code(400).send({ error: result.error.issues })

  const order = await repo.create(result.data as CreateOrder)
  await publish(channel, QUEUES.ORDER_PLACED, {
    orderId: order.id,
    customerId: order.customer_id,
  })
  app.log.info({ orderId: order.id }, 'order_placed published')
  return reply.code(201).send(order)
})

app.get<{ Params: { id: string } }>('/api/v1/orders/:id', async (req, reply) => {
  const order = await repo.findById(req.params.id)
  if (!order) return reply.code(404).send({ error: 'Order not found' })
  return order
})

async function start() {
  channel = await connectRabbitMQ()

  app.listen({ host: '0.0.0.0', port: PORT }, (err) => {
    if (err) { app.log.error(err); process.exit(1) }
  })
}

start().catch(err => { console.error(err); process.exit(1) })
