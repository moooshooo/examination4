// src/product-service/repository.ts
import { pool } from '../shared/db'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: 'food' | 'drink'
  available: boolean
  created_at: string
}

export class ProductRepository {
  async findAll(): Promise<Product[]> {
    const { rows } = await pool.query<Product>(
      `SELECT * FROM products WHERE available = TRUE ORDER BY category, name`
    )
    return rows
  }

  async findById(id: string): Promise<Product | null> {
    const { rows } = await pool.query<Product>(
      `SELECT * FROM products WHERE id = $1`,
      [id]
    )
    return rows[0] ?? null
  }
}
