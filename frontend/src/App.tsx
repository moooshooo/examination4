// frontend/src/App.tsx
import { useState, useEffect, useCallback } from 'react'
import {
  Box, Typography, Grid, Card, CardContent, CardActions,
  Button, TextField, Chip, Alert, CircularProgress,
  Container, Divider, Stack,
} from '@mui/material'
import { getProducts, placeOrder, getOrder } from './api'
import type { Product, Order } from './api'

interface CartItem { productId: string; name: string; quantity: number }

// ── Menykortet ────────────────────────────────────────────────────────────────
function MenuCard({
  product, cart, onAdd, onRemove,
}: {
  product: Product
  cart: CartItem[]
  onAdd: (p: Product) => void
  onRemove: (id: string) => void
}) {
  const inCart = cart.find(i => i.productId === product.id)
  const emoji  = product.category === 'drink' ? '🫧' : '🍽️'

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="body1" color="secondary" sx={{ mb: 1 }}>
          {emoji} {product.name}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5, lineHeight: 1.6 }}>
          {product.description}
        </Typography>
        <Typography variant="body2" color="primary">
          {Number(product.price).toFixed(2)} kr
        </Typography>
      </CardContent>
      <CardActions sx={{ p: 1.5, pt: 0 }}>
        {inCart ? (
          <Stack direction="row" alignItems="center" spacing={1} sx={{ width: '100%' }}>
            <Button size="small" variant="outlined" onClick={() => onRemove(product.id)} sx={{ minWidth: 32, px: 1 }}>−</Button>
            <Chip label={inCart.quantity} size="small" color="primary" />
            <Button size="small" variant="outlined" onClick={() => onAdd(product)} sx={{ minWidth: 32, px: 1 }}>+</Button>
          </Stack>
        ) : (
          <Button size="small" variant="outlined" fullWidth onClick={() => onAdd(product)}>
            + LÄGG TILL
          </Button>
        )}
      </CardActions>
    </Card>
  )
}

// ── Huvud-app ─────────────────────────────────────────────────────────────────
export default function App() {
  const [products, setProducts]   = useState<Product[]>([])
  const [cart, setCart]           = useState<CartItem[]>([])
  const [customerId, setCustomerId] = useState('')
  const [order, setOrder]         = useState<Order | null>(null)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState<string | null>(null)

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => setError('Kunde inte nå menyn — är köket öppet? 🐸'))
  }, [])

  // Polla orderstatus var 3:e sekund tills den är "ready"
  useEffect(() => {
    if (!order || order.status === 'ready' || order.status === 'delivered') return
    const id = setInterval(async () => {
      const updated = await getOrder(order.id).catch(() => null)
      if (updated) setOrder(updated)
    }, 3000)
    return () => clearInterval(id)
  }, [order])

  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const hit = prev.find(i => i.productId === product.id)
      if (hit) return prev.map(i => i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, { productId: product.id, name: product.name, quantity: 1 }]
    })
  }, [])

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => {
      const hit = prev.find(i => i.productId === productId)
      if (hit && hit.quantity > 1) return prev.map(i => i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i)
      return prev.filter(i => i.productId !== productId)
    })
  }, [])

  const submitOrder = async () => {
    if (!customerId.trim() || cart.length === 0) return
    setLoading(true)
    setError(null)
    try {
      const o = await placeOrder({ customerId, items: cart.map(i => ({ productId: i.productId, quantity: i.quantity })) })
      setOrder(o)
      setCart([])
    } catch {
      setError('Ordern misslyckades — försök igen!')
    } finally {
      setLoading(false)
    }
  }

  const foodItems  = products.filter(p => p.category === 'food')
  const drinkItems = products.filter(p => p.category === 'drink')
  const cartTotal  = cart.reduce((sum, i) => {
    const p = products.find(pr => pr.id === i.productId)
    return sum + (p ? Number(p.price) * i.quantity : 0)
  }, 0)

  const statusEmoji: Record<string, string> = {
    placed: '📋', preparing: '🍳', ready: '🔔', delivered: '✅',
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 8 }}>
      {/* ── Header ── */}
      <Box sx={{
        bgcolor: '#0a1a0a',
        borderBottom: '4px solid',
        borderColor: 'primary.main',
        py: 3, mb: 4,
        boxShadow: '0 4px 0 #000',
      }}>
        <Container>
          <Typography variant="h4" color="primary" align="center" sx={{ mb: 1 }}>
            🐸 TOADS DELIGHT 🐸
          </Typography>
          <Typography variant="caption" color="secondary" align="center" display="block">
            ✦ DAMMETS FINASTE KROG — SEDAN GÖMINNAN ✦
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* ── Orderstatus ── */}
        {order && (
          <Alert
            severity={order.status === 'ready' ? 'success' : 'info'}
            sx={{ mb: 3, '& .MuiAlert-message': { width: '100%' } }}
          >
            <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
              ORDER: {order.id.slice(0, 8).toUpperCase()}…
            </Typography>
            <Typography variant="caption">
              STATUS: {statusEmoji[order.status] ?? '⏳'} {order.status.toUpperCase()}
              {order.status === 'ready' && ' — VÄLKOMMEN ATT HÄMTA VID DAMMKANTEN!'}
            </Typography>
          </Alert>
        )}

        {/* ── Mat ── */}
        <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
          ══ [ MAT ] ══
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {foodItems.map(p => (
            <Grid item xs={12} sm={6} md={4} key={p.id}>
              <MenuCard product={p} cart={cart} onAdd={addToCart} onRemove={removeFromCart} />
            </Grid>
          ))}
        </Grid>

        {/* ── Dryck ── */}
        <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
          ══ [ DRYCK ] ══
        </Typography>
        <Grid container spacing={2} sx={{ mb: 5 }}>
          {drinkItems.map(p => (
            <Grid item xs={12} sm={6} md={4} key={p.id}>
              <MenuCard product={p} cart={cart} onAdd={addToCart} onRemove={removeFromCart} />
            </Grid>
          ))}
        </Grid>

        {/* ── Varukorg ── */}
        {cart.length > 0 && (
          <Box sx={{
            border: '2px solid',
            borderColor: 'primary.main',
            p: 3,
            boxShadow: '6px 6px 0 #000',
            bgcolor: 'background.paper',
          }}>
            <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
              ══ [ DIN ORDER ] ══
            </Typography>

            {cart.map(item => (
              <Typography key={item.productId} variant="caption" display="block" sx={{ mb: 0.5 }}>
                › {item.name} × {item.quantity}
              </Typography>
            ))}

            <Divider sx={{ my: 2 }} />

            <Typography variant="caption" color="secondary" display="block" sx={{ mb: 2 }}>
              TOTALT: {cartTotal.toFixed(2)} kr
            </Typography>

            <TextField
              label="DITT NAMN / ID"
              value={customerId}
              onChange={e => setCustomerId(e.target.value)}
              fullWidth
              size="small"
              sx={{ mb: 2 }}
            />

            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={submitOrder}
              disabled={loading || !customerId.trim()}
              size="large"
            >
              {loading
                ? <CircularProgress size={14} color="inherit" />
                : '>> BESTÄLL HOS TOAD <<'}
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  )
}
