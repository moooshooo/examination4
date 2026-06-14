// src/shared/redis.ts
import Redis from 'ioredis'

export const redis = new Redis(process.env.REDIS_URL ?? 'redis://redis:6379', {
  lazyConnect: true,
  maxRetriesPerRequest: 1,
})

redis.on('error', (err) => {
  console.warn('Redis warning (cache disabled):', err.message)
})
