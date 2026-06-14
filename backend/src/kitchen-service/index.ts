// src/kitchen-service/index.ts
import { createServer } from '../shared/createServer'
import { connectRabbitMQ, consume, publish } from '../shared/rabbitmq'
import { pool } from '../shared/db'
import { QUEUES } from '../shared/types'

const app   = createServer('kitchen-service')
const PORT  = Number(process.env.PORT) || 3003
const COOK_TIME_MS = 30_000

async function setOrderStatus(orderId: string, status: 'cooking' | 'ready') {
  await pool.query(`UPDATE orders SET status = $1 WHERE id = $2`, [status, orderId])
}

async function start() {
  const channel = await connectRabbitMQ()

  await consume(channel, QUEUES.ORDER_PLACED, async (msg: any) => {
    const { orderId, customerId } = msg

    app.log.info({ orderId }, 'Köket: order mottagen — sätter COOKING')
    await setOrderStatus(orderId, 'cooking')

    await new Promise(r => setTimeout(r, COOK_TIME_MS))

    app.log.info({ orderId }, 'Köket: klar — sätter READY och publicerar order_ready')
    await setOrderStatus(orderId, 'ready')
    await publish(channel, QUEUES.ORDER_READY, { orderId, customerId })
  })

  app.listen({ host: '0.0.0.0', port: PORT }, (err) => {
    if (err) { app.log.error(err); process.exit(1) }
  })
}

start().catch(err => { console.error(err); process.exit(1) })
