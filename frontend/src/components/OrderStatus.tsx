// frontend/src/components/OrderStatus.tsx
import { Alert, Typography } from "@mui/material";
import type { Order } from "../api";

const STATUS_EMOJI: Record<string, string> = {
  placed: "📋",
  cooking: "👨‍🍳",
  ready: "✅",
};

export default function OrderStatus({ order }: { order: Order | null }) {
  if (!order) return null;

  return (
    <Alert
      severity={order.status === "ready" ? "success" : "info"}
      sx={{ mb: 3, "& .MuiAlert-message": { width: "100%" } }}
    >
      <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
        ORDER: {order.id.slice(0, 8).toUpperCase()}…
      </Typography>
      <Typography variant="caption">
        STATUS: {STATUS_EMOJI[order.status] ?? "⏳"} {order.status.toUpperCase()}
        {order.status === "ready" && " — VÄLKOMMEN ATT HÄMTA VID DAMMKANTEN!"}
      </Typography>
    </Alert>
  );
}
