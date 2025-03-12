// src/App.jsx
import React, { useState, useMemo, useEffect } from "react";
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  Switch,
  AppBar,
  Toolbar,
  Typography,
  Container,
} from "@mui/material";
import DataTable from "./components/DataTable";

// Function to generate the theme
const getTheme = (darkMode) =>
  createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: "f50057",
      },
      background: {
        default: darkMode ? "#121212" : "#f5f5f5",
        paper: darkMode ? "#1e1e1e" : "#ffffff",
      },
      text: {
        primary: darkMode ? "#ffffff" : "#000000",
        secondary:"#4caf50",
      },
    },
  });

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return JSON.parse(localStorage.getItem("darkMode")) || false;
  });

  const theme = useMemo(() => getTheme(darkMode), [darkMode]);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            MUI DataGrid Example
          </Typography>
          <Switch
            checked={darkMode}
            onChange={() => setDarkMode((prev) => !prev)}
            color="default"
          />
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={styles.container}>
        <DataTable />
      </Container>
    </ThemeProvider>
  );
}

const styles = {
  container: {
    padding: "16px",
    borderRadius: "8px",
    marginTop: "16px",
  },
};

export default App;
