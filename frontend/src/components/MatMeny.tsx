// frontend/src/components/MatMeny.tsx
import { Grid, Typography } from "@mui/material";
import MenuCard from "./MenuCard";
import type { Product } from "../api";

interface CartItem {
  productId: string;
  name: string;
  quantity: number;
}

export default function MatMeny({
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
        ══ [ MAT ] ══
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
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
