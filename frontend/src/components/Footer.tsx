import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

export default function Footer() {
  return (
    <Container>
      <Box sx={{ textAlign: "center", py: 3 }}>
        <Typography variant="caption" sx={{ display: "block", color: "text.secondary" }}>
          © Copy it! Its your right 2026 !
        </Typography>
        <Typography variant="caption" sx={{ display: "block", color: "text.secondary" }}>
          by <a href="https://www.moshos.se" style={{ color: "inherit", textDecoration: "none" }} target="_blank">mosho</a>
        </Typography>
      </Box>
    </Container>
  );
}
