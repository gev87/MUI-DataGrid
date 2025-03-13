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
import styles from "./App.module.css"; 

const getTheme = (darkMode) =>
  createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: "#f50057" },
      background: {
        default: darkMode ? "#121212" : "#f5f5f5",
        paper: darkMode ? "#1e1e1e" : "#ffffff",
      },
      text: {
        primary: darkMode ? "#ffffff" : "#000000",
        secondary: "#4caf50",
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
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <style>
        {`:root {
          --primary-color: ${theme.palette.primary.main};
          --text-primary: ${theme.palette.text.primary};
          --text-secondary: ${theme.palette.text.secondary};
        }`}
      </style>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={styles.title}>
           Movie List
          </Typography>
          <Switch
            checked={darkMode}
            onChange={() => setDarkMode((prev) => !prev)}
            color="default"
          />
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" className={styles.appContainer}>
        <DataTable />
      </Container>
    </ThemeProvider>
  );
}

export default App;
