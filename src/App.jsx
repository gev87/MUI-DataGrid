// src/App.jsx
import React, { useState, useMemo } from "react";
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  Switch,
  AppBar,
  Toolbar,
  Typography,
} from "@mui/material";
import DataTable from "./DataTable";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
        },
      }),
    [darkMode]
  );

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            MUI DataGrid Example
          </Typography>
          <Switch
            checked={darkMode}
            onChange={handleThemeChange}
            color="default"
          />
        </Toolbar>
      </AppBar>
      <div style={{ padding: "16px" }}>
        <DataTable />
      </div>
    </ThemeProvider>
  );
}

export default App;
