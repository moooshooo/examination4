// src/notification-service/index.ts
import { createServer } from '../shared/createServer'
import { connectRabbitMQ, consume } from '../shared/rabbitmq'
import { QUEUES } from '../shared/types'

const app = createServer('notification-service')
const PORT = Number(process.env.PORT) || 3004

async function start() {
  const channel = await connectRabbitMQ()

  await consume(channel, QUEUES.ORDER_READY, async (msg: any) => {
    app.log.info(
      { orderId: msg.orderId, customerId: msg.customerId },
      'NOTIS: Din order är klar, välkommen att hämta vid dammkanten!'
    )
  })

  app.listen({ host: '0.0.0.0', port: PORT }, (err) => {
    if (err) { app.log.error(err); process.exit(1) }
  })
}

start().catch(err => { console.error(err); process.exit(1) })
