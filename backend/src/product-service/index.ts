// src/product-service/index.ts
import { createServer } from '../shared/createServer'
import { ProductRepository } from './repository'

const app = createServer('product-service')
const repo = new ProductRepository()
const PORT = Number(process.env.PORT) || 3001

app.get('/api/v1/products', async () => repo.findAll())

app.get<{ Params: { id: string } }>('/api/v1/products/:id', async (req, reply) => {
  const product = await repo.findById(req.params.id)
  if (!product) return reply.code(404).send({ error: 'Product not found' })
  return product
})

app.listen({ host: '0.0.0.0', port: PORT }, (err) => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
})
