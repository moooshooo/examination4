// frontend/src/components/Varukorg.tsx
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";
import type { Product } from "../api";

interface CartItem {
  productId: string;
  name: string;
  quantity: number;
}

export default function Varukorg({
  cart,
  products,
  customerId,
  setCustomerId,
  onSubmit,
  loading,
}: {
  cart: CartItem[];
  products: Product[];
  customerId: string;
  setCustomerId: (v: string) => void;
  onSubmit: () => void;
  loading: boolean;
}) {
  if (cart.length === 0) return null;

  const total = cart.reduce((sum, i) => {
    const p = products.find((pr) => pr.id === i.productId);
    return sum + (p ? Number(p.price) * i.quantity : 0);
  }, 0);

  return (
    <Box
      sx={{
        border: "2px solid",
        borderColor: "primary.main",
        p: 3,
        boxShadow: "6px 6px 0 #000",
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
        ══ [ DIN ORDER ] ══
      </Typography>

      {cart.map((item) => (
        <Typography key={item.productId} variant="caption" display="block" sx={{ mb: 0.5 }}>
          › {item.name} × {item.quantity}
        </Typography>
      ))}

      <Divider sx={{ my: 2 }} />

      <Typography variant="caption" color="secondary" display="block" sx={{ mb: 2 }}>
        TOTALT: {Math.round(total)} kr
      </Typography>

      <TextField
        label="DITT NAMN / ID"
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
        fullWidth
        size="small"
        sx={{ mb: 2 }}
      />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={onSubmit}
        disabled={loading || !customerId.trim()}
        size="large"
      >
        {loading ? (
          <CircularProgress size={14} color="inherit" />
        ) : (
          ">> BESTÄLL HOS TOAD <<"
        )}
      </Button>
    </Box>
  );
}
