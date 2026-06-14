// src/product-service/repository.ts
import { pool } from '../shared/db'
import { redis } from '../shared/redis'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: 'food' | 'drink'
  available: boolean
  created_at: string
}

const CACHE_KEY = 'products:all'
const CACHE_TTL = 60 // sekunder

export class ProductRepository {
  async findAll(): Promise<Product[]> {
    try {
      const cached = await redis.get(CACHE_KEY)
      if (cached) {
        console.log('Cache HIT — products:all')
        return JSON.parse(cached)
      }
    } catch {
      // Redis nere — gå direkt till DB
    }

    console.log('Cache MISS — hämtar från PostgreSQL')
    const { rows } = await pool.query<Product>(
      `SELECT * FROM products WHERE available = TRUE ORDER BY category, name`
    )

    try {
      await redis.set(CACHE_KEY, JSON.stringify(rows), 'EX', CACHE_TTL)
    } catch {
      // Skriv-fel i Redis — returnera ändå DB-resultatet
    }

    return rows
  }

  async findById(id: string): Promise<Product | null> {
    // Försök hämta ur cachad lista innan DB-anrop
    try {
      const cached = await redis.get(CACHE_KEY)
      if (cached) {
        const products: Product[] = JSON.parse(cached)
        const hit = products.find(p => p.id === id)
        if (hit) return hit
      }
    } catch {}

    const { rows } = await pool.query<Product>(
      `SELECT * FROM products WHERE id = $1`,
      [id]
    )
    return rows[0] ?? null
  }
}
