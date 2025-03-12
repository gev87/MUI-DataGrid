import React from "react";
import { Typography, useTheme } from "@mui/material";

function Columns({ onImageClick }) {
  const theme = useTheme();

  return [
    {
      field: "image",
      headerName: "Poster",
      width: 120,
      sortable: false,
      renderCell: (params) =>
        params.value ? (
          <img
            src={params.value}
            alt="poster"
            style={{
              width: "100%",
              objectFit: "contain",
              cursor: "pointer",
              marginTop: "10px",
            }}
            onClick={(event) => {
              event.stopPropagation();
              onImageClick(params.value);
            }}
          />
        ) : (
          "N/A"
        ),
    },
    {
      field: "description",
      headerName: "Description",
      width: 200,
      renderCell: (params) => (
        <Typography
          style={{
            fontStyle: "italic",
            color: theme.palette.text.primary,
            whiteSpace: "normal",
            wordWrap: "break-word",
            display: "block",
            cursor: "pointer",
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "date",
      headerName: "Release Date",
      width: 150,
      renderCell: (params) => (
        <Typography
          style={{ fontWeight: "bold", color: theme.palette.primary.main , cursor: "pointer" }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "number",
      headerName: "Rating",
      width: 120,

      renderCell: (params) => (
        <Typography style={{ color: theme.palette.text.secondary, cursor: "pointer" }}>
          {params.value}
        </Typography>
      ),
    },
  ];
}

export default Columns;
