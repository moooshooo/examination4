// frontend/src/components/Header.tsx
import { Box, Container, Typography } from "@mui/material";

export default function Header() {
  return (
    <Box
      sx={{
        bgcolor: "#0a1a0a",
        borderBottom: "4px solid",
        borderColor: "primary.main",
        py: 3,
        mb: 4,
        boxShadow: "0 4px 0 #000",
      }}
    >
      <Container >
        <Typography variant="h3" color="primary" align="center">
          TOADS DELIGHT
        </Typography>
        <Typography
          variant="caption"
          color="secondary"
          align="center"
          display="block" sx={{ mb: 2 }}
        >
          ✦ DAMMETS FINASTE KROG — SEDAN GÖMINNAN ✦
        </Typography>
        <Box
          component="img"
          src="/toads_delight_banner.jpeg"
          alt="Toads Delight"
          sx={{
            display: "block",
            width: "100%",
            height: 270,
            objectFit: "cover",
            imageRendering: "pixelated",
            mb: 0,
          }}
        />
      </Container>
    </Box>
  );
}
