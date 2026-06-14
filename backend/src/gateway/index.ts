// src/gateway/index.ts
import { createServer } from '../shared/createServer'

const app = createServer('gateway')
const PORT = Number(process.env.PORT) || 3000

app.listen({ host: '0.0.0.0', port: PORT }, (err) => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
})
