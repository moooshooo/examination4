// src/order-service/repository.ts
import { pool } from '../shared/db'
import type { CreateOrder } from '../shared/types'

export interface Order {
  id: string
  customer_id: string
  status: 'placed' | 'preparing' | 'ready' | 'delivered'
  created_at: string
}

export class OrderRepository {
  async create(data: CreateOrder): Promise<Order> {
    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      const { rows } = await client.query<Order>(
        `INSERT INTO orders (customer_id) VALUES ($1) RETURNING *`,
        [data.customerId]
      )
      const order = rows[0]
      for (const item of data.items) {
        await client.query(
          `INSERT INTO order_items (order_id, product_id, quantity) VALUES ($1, $2, $3)`,
          [order.id, item.productId, item.quantity]
        )
      }
      await client.query('COMMIT')
      return order
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    } finally {
      client.release()
    }
  }

  async findById(id: string): Promise<Order | null> {
    const { rows } = await pool.query<Order>(
      `SELECT * FROM orders WHERE id = $1`,
      [id]
    )
    return rows[0] ?? null
  }

  async updateStatus(id: string, status: Order['status']): Promise<void> {
    await pool.query(`UPDATE orders SET status = $1 WHERE id = $2`, [status, id])
  }
}
