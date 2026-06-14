// frontend/src/components/Anslagstavla.tsx
import { useQuery } from '@tanstack/react-query'
import { Box, Typography, Divider, CircularProgress } from '@mui/material'
import { getActiveOrders } from '../api'
import type { Order } from '../api'

const STATUS_LABEL: Record<string, { emoji: string; label: string; color: string }> = {
  placed:  { emoji: '📋', label: 'PLACED',  color: '#cddc39' },
  cooking: { emoji: '👨‍🍳', label: 'COOKING', color: '#ff9800' },
  ready:   { emoji: '✅', label: 'READY',   color: '#4caf50' },
}

function shortId(id: string) {
  return id.slice(0, 6).toUpperCase()
}

function orderTime(iso: string) {
  return new Date(iso).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })
}

export default function Anslagstavla() {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['active-orders'],
    queryFn: getActiveOrders,
    refetchInterval: 2000,
  })

  return (
    <Box sx={{
      width: '100%',
      bgcolor: '#0a1a0a',
      borderBottom: '4px solid',
      borderColor: 'primary.main',
      boxShadow: '0 4px 0 #000',
      mb: '5px',
      p: 2,
    }}>
      <Typography variant="h6" color="primary" align="center" sx={{ mb: 1 }}>
        📋 ORDRAR
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress size={16} color="primary" />
        </Box>
      )}

      {!isLoading && orders.length === 0 && (
        <Typography variant="caption" color="text.secondary" align="center" display="block">
          Inga aktiva ordrar
        </Typography>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1.5, overflowX: 'auto' }}>
        {orders.map((order: Order) => {
          const s = STATUS_LABEL[order.status] ?? { emoji: '⏳', label: order.status.toUpperCase(), color: '#888' }
          return (
            <Box key={order.id} sx={{
              minWidth: 140,
              flexShrink: 0,
              p: 1,
              border: '2px solid',
              borderColor: s.color,
              boxShadow: `2px 2px 0 #000`,
            }}>
              <Typography variant="caption" display="block" sx={{ color: '#81c784', mb: 0.5 }}>
                #{shortId(order.id)} · {orderTime(order.created_at)}
              </Typography>
              <Typography variant="caption" sx={{ color: s.color, fontWeight: 'bold' }}>
                {s.emoji} {s.label}
              </Typography>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
