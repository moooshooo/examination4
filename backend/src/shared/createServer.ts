// src/shared/createServer.ts
import Fastify, { type FastifyInstance } from 'fastify'
import fastifyCors from '@fastify/cors'
import fastifyHelmet from '@fastify/helmet'
import fastifyRateLimit from '@fastify/rate-limit'
export function createServer(serviceName: string): FastifyInstance {
  const app = Fastify({ logger: true })

  app.register(fastifyCors)
  app.register(fastifyHelmet)
  app.register(fastifyRateLimit, { max: 100, timeWindow: '1 minute' })

  app.get('/api/health', async () => ({
    status: 'ok',
    service: serviceName,
    timestamp: new Date().toISOString(),
  }))

  return app
}
