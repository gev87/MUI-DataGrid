import React from "react";
import { Typography } from "@mui/material";
import styles from "./Columns.module.css";

function Columns({ onImageClick }) {
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
            className={styles.imageCell}
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
        <Typography className={styles.descriptionCell}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "date",
      headerName: "Release Date",
      width: 150,
      renderCell: (params) => (
        <Typography className={styles.dateCell}>{params.value}</Typography>
      ),
    },
    {
      field: "number",
      headerName: "Rating",
      width: 120,
      renderCell: (params) => (
        <Typography className={styles.ratingCell}>{params.value}</Typography>
      ),
    },
  ];
}

export default Columns;
