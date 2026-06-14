// src/kitchen-service/index.ts
import { createServer } from '../shared/createServer'
import { connectRabbitMQ, consume, publish } from '../shared/rabbitmq'
import { QUEUES } from '../shared/types'

const app = createServer('kitchen-service')
const PORT = Number(process.env.PORT) || 3003

async function start() {
  const channel = await connectRabbitMQ()

  await consume(channel, QUEUES.ORDER_PLACED, async (msg: any) => {
    app.log.info({ orderId: msg.orderId }, 'Köket: order mottagen, lagar mat...')
    await new Promise(r => setTimeout(r, 2000))
    await publish(channel, QUEUES.ORDER_READY, {
      orderId: msg.orderId,
      customerId: msg.customerId,
    })
    app.log.info({ orderId: msg.orderId }, 'Köket: order_ready publicerat')
  })

  app.listen({ host: '0.0.0.0', port: PORT }, (err) => {
    if (err) { app.log.error(err); process.exit(1) }
  })
}

start().catch(err => { console.error(err); process.exit(1) })
