// frontend/src/components/DrykMeny.tsx
import { Grid, Typography } from "@mui/material";
import MenuCard from "./MenuCard";
import type { Product } from "../api";

interface CartItem {
  productId: string;
  name: string;
  quantity: number;
}

export default function DrykMeny({
  products,
  cart,
  onAdd,
  onRemove,
}: {
  products: Product[];
  cart: CartItem[];
  onAdd: (p: Product) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <>
      <Typography variant="h4" color="primary" sx={{ mb: 2 }}>
        ══ [ DRYCK ] ══
      </Typography>
      <Grid container spacing={2} sx={{ mb: 5 }}>
        {products.map((p) => (
          <Grid item xs={12} sm={6} md={4} key={p.id}>
            <MenuCard
              product={p}
              cart={cart}
              onAdd={onAdd}
              onRemove={onRemove}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
