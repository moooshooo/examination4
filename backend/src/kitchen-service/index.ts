import { createServer } from '../shared/createServer'
import { connectRabbitMQ, consume, publish } from '../shared/rabbitmq'
import { pool } from '../shared/db'
import { QUEUES } from '../shared/types'

const app = createServer('kitchen-service')
const PORT = Number(process.env.PORT) || 3003

let channel: Awaited<ReturnType<typeof connectRabbitMQ>>

async function setOrderStatus(orderId: string, status: 'cooking' | 'ready') {
  await pool.query(`UPDATE orders SET status = $1 WHERE id = $2`, [status, orderId])
}

app.post<{ Params: { orderId: string }; Body: { status: 'cooking' | 'ready' } }>(
  '/api/kitchen/orders/:orderId/status',
  async (req, reply) => {
    const { orderId } = req.params
    const { status } = req.body as { status?: string }

    if (status !== 'cooking' && status !== 'ready') {
      return reply.code(400).send({ error: 'status must be cooking or ready' })
    }

    await setOrderStatus(orderId, status)

    if (status === 'ready') {
      const result = await pool.query(`SELECT customer_id FROM orders WHERE id = $1`, [orderId])
      const customerId = result.rows[0]?.customer_id
      await publish(channel, QUEUES.ORDER_READY, { orderId, customerId })
    }

    return reply.code(200).send({ orderId, status })
  }
)

async function start() {
  channel = await connectRabbitMQ()

  await consume(channel, QUEUES.ORDER_PLACED, async (msg: any) => {
    const { orderId, customerId } = msg
    await setOrderStatus(orderId, 'cooking')
    await publish(channel, QUEUES.ORDER_READY, { orderId, customerId })
  })

  app.listen({ host: '0.0.0.0', port: PORT }, (err) => {
    if (err) { app.log.error(err); process.exit(1) }
  })
}

start().catch(err => { console.error(err); process.exit(1) })
