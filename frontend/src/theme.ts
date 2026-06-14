// frontend/src/theme.ts
import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    background: { default: "#0d1a0d", paper: "#132013" },
    primary: { main: "#4caf50" },
    secondary: { main: "#cddc39" },
    text: { primary: "#c8e6c9", secondary: "#81c784" },
  },
  typography: {
    fontFamily: '"Press Start 2P", monospace',
    fontSize: 10,
    h3: { fontSize: "1.2rem", lineHeight: 1.8 },
    h4: { fontSize: "1.1rem", lineHeight: 1.8 },
    h6: { fontSize: "0.8rem", lineHeight: 1.8 },
    body1: { fontSize: "0.65rem", lineHeight: 1.8 },
    body2: { fontSize: "0.6rem", lineHeight: 1.8 },
    caption: { fontSize: "0.6rem", lineHeight: 1.8 },
  },
  shape: { borderRadius: 0 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: "4px 4px 0 #000",
          transition: "none",
          fontSize: "0.55rem",
          "&:active": {
            boxShadow: "1px 1px 0 #000",
            transform: "translate(3px,3px)",
          },
          "&:hover": { boxShadow: "4px 4px 0 #000" },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "4px 4px 0 rgba(0,0,0,0.9)",
          border: "2px solid #2e7d32",
        },
      },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: 0, fontSize: "0.6rem" } },
    },
    MuiAlert: {
      styleOverrides: { root: { borderRadius: 0, fontSize: "0.6rem" } },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": { borderRadius: 0 },
          "& input": {
            fontSize: "0.6rem",
            fontFamily: '"Press Start 2P", monospace',
          },
          "& label": {
            fontSize: "0.6rem",
            fontFamily: '"Press Start 2P", monospace',
          },
        },
      },
    },
    MuiDivider: { styleOverrides: { root: { borderColor: "#2e7d32" } } },
  },
});
