// frontend/src/App.tsx
import { useState, useEffect, useCallback } from "react";
import { Box, Container, Alert } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getProducts, placeOrder, getOrder } from "./api";
import type { Product, Order } from "./api";
import Header from "./components/Header";
import MatMeny from "./components/MatMeny";
import DrykMeny from "./components/DryckMeny";
import Varukorg from "./components/Varukorg";
import OrderStatus from "./components/OrderStatus";
import Anslagstavla from "./components/Anslagstavla";
import Footer from "./components/Footer";

interface CartItem {
  productId: string;
  name: string;
  quantity: number;
}

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: products = [], isError: productsError } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  useEffect(() => {
    if (productsError) setError("Kunde inte nå menyn — är köket öppet? 🐸");
  }, [productsError]);

  useEffect(() => {
    if (!order || order.status === "ready") return;
    const id = setInterval(async () => {
      const updated = await getOrder(order.id).catch(() => null);
      if (updated) setOrder(updated);
    }, 3000);
    return () => clearInterval(id);
  }, [order]);

  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const hit = prev.find((i) => i.productId === product.id);
      if (hit)
        return prev.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      return [
        ...prev,
        { productId: product.id, name: product.name, quantity: 1 },
      ];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => {
      const hit = prev.find((i) => i.productId === productId);
      if (hit && hit.quantity > 1)
        return prev.map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i,
        );
      return prev.filter((i) => i.productId !== productId);
    });
  }, []);

  const submitOrder = async () => {
    if (!customerId.trim() || cart.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const o = await placeOrder({
        customerId,
        items: cart.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
      });
      setOrder(o);
      setCart([]);
    } catch {
      setError("Ordern misslyckades — försök igen!");
    } finally {
      setLoading(false);
    }
  };

  const foodItems = products.filter((p) => p.category === "food");
  const drinkItems = products.filter((p) => p.category === "drink");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Header />

      <Box
        sx={{
          display: "flex",
          flex: 1,
          "@media (max-width: 399px)": { flexDirection: "column" },
        }}
      >
        <Box sx={{ flex: 1, pb: 8, minWidth: 0 }}>
          <Container maxWidth="lg">
            {error && (
              <Alert
                severity="error"
                sx={{ mb: 3 }}
                onClose={() => setError(null)}
              >
                {error}
              </Alert>
            )}
        
          <Anslagstavla />
        

            <OrderStatus order={order} />
            <Varukorg
              cart={cart}
              products={products}
              customerId={customerId}
              setCustomerId={setCustomerId}
              onSubmit={submitOrder}
              loading={loading}
            />
            <MatMeny
              products={foodItems}
              cart={cart}
              onAdd={addToCart}
              onRemove={removeFromCart}
            />
            <DrykMeny
              products={drinkItems}
              cart={cart}
              onAdd={addToCart}
              onRemove={removeFromCart}
            />
          </Container>
          <Footer />
        </Box>
      </Box>

    </Box>
  );
}
