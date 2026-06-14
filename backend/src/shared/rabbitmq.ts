// src/shared/rabbitmq.ts
import amqplib, { type Channel } from 'amqplib'

export async function connectRabbitMQ(retries = 10, delayMs = 2000): Promise<Channel> {
  for (let i = 1; i <= retries; i++) {
    try {
      const conn = await amqplib.connect(process.env.RABBITMQ_URL!)
      const channel = await conn.createChannel()
      console.log('RabbitMQ connected')
      return channel
    } catch {
      if (i === retries) throw new Error('Could not connect to RabbitMQ after retries')
      console.log(`RabbitMQ not ready, retry ${i}/${retries}...`)
      await new Promise(r => setTimeout(r, delayMs))
    }
  }
  throw new Error('unreachable')
}

export async function publish(channel: Channel, queue: string, message: object): Promise<void> {
  await channel.assertQueue(queue, { durable: true })
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true })
}

export async function consume(
  channel: Channel,
  queue: string,
  handler: (msg: object) => Promise<void>
): Promise<void> {
  await channel.assertQueue(queue, { durable: true })
  channel.consume(queue, async (msg) => {
    if (!msg) return
    try {
      await handler(JSON.parse(msg.content.toString()))
      channel.ack(msg)
    } catch (err) {
      console.error('Consumer error:', err)
      channel.nack(msg, false, false)
    }
  })
}
