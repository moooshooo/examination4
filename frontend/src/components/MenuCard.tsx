// frontend/src/components/MenuCard.tsx
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Chip,
  Stack,
} from "@mui/material";
import type { Product } from "../api";

interface CartItem {
  productId: string;
  name: string;
  quantity: number;
}

export default function MenuCard({
  product,
  cart,
  onAdd,
  onRemove,
}: {
  product: Product;
  cart: CartItem[];
  onAdd: (p: Product) => void;
  onRemove: (id: string) => void;
}) {
  const inCart = cart.find((i) => i.productId === product.id);
  const emoji = product.category === "drink" ? "🫧" : "🍽️";

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="body1" color="secondary" sx={{ mb: 1, mt: 1 }}>
          {emoji} {product.name}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          sx={{ mb: 1.5, lineHeight: 1.6 }}
        >
          {product.description}
        </Typography>
        <Typography variant="body2" color="primary">
          {Math.round(Number(product.price))} kr
        </Typography>
      </CardContent>
      <CardActions sx={{ p: 1.5, pt: 0 }}>
        {inCart ? (
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ width: "100%" }}
          >
            <Button
              size="small"
              variant="outlined"
              onClick={() => onRemove(product.id)}
              sx={{ minWidth: 32, px: 1 }}
            >
              −
            </Button>
            <Chip label={inCart.quantity} size="small" color="primary" />
            <Button
              size="small"
              variant="outlined"
              onClick={() => onAdd(product)}
              sx={{ minWidth: 32, px: 1 }}
            >
              +
            </Button>
          </Stack>
        ) : (
          <Button
            size="small"
            variant="outlined"
            fullWidth
            onClick={() => onAdd(product)}
          >
            + LÄGG TILL
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
