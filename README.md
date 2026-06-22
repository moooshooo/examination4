# Toads Delight

Mikroservicebaserat restaurangsystem byggt med Fastify, RabbitMQ och PostgreSQL.

## Starta systemet

```bash
cp backend/.env.example backend/.env
# Fyll i lösenord i backend/.env

docker compose up --build
```

Systemet startar automatiskt med DDL och seed-data via `backend/db/init.sql`.

## Publik ingång

Allt trafik går via nginx på port **8015**:

| Resurs | Metod | URL |
|---|---|---|
| Produkter | GET | `http://localhost:8015/api/v1/products` |
| Skapa order | POST | `http://localhost:8015/api/v1/orders` |
| Hämta order | GET | `http://localhost:8015/api/v1/orders/:id` |
| Aktiva ordrar | GET | `http://localhost:8015/api/v1/orders/active` |
| Uppdatera kökets status | POST | `http://localhost:8015/api/v1/kitchen/orders/:id/status` |

## Testa flödet

```bash
cd backend
bun test src/tests/flow.test.ts
```

Testerna kräver att systemet är igång och nåbart på `http://localhost:8015`.
