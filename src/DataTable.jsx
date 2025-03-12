// src/DataTable.jsx
import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Dialog, DialogTitle, DialogContent, Typography } from "@mui/material";

const API_KEY = "7b99404a"; // Your valid OMDb API key
const SEARCH_QUERY = "love"; // Default search query
const ITEMS_PER_PAGE = 10;

function DataTable() {
  const [rows, setRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openRowModal, setOpenRowModal] = useState(false);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [page, setPage] = useState(1); // Current page number
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0); // Total results count

  // Persist sort and filter state using localStorage
  const [sortModel, setSortModel] = useState(() => {
    const saved = localStorage.getItem("sortModel");
    return saved ? JSON.parse(saved) : [];
  });
  const [filterModel, setFilterModel] = useState(() => {
    const saved = localStorage.getItem("filterModel");
    return saved ? JSON.parse(saved) : { items: [] };
  });

  useEffect(() => {
    localStorage.setItem("sortModel", JSON.stringify(sortModel));
  }, [sortModel]);

  useEffect(() => {
    localStorage.setItem("filterModel", JSON.stringify(filterModel));
  }, [filterModel]);

  // Fetch movies from OMDb API using a default search query.
  useEffect(() => {
    setLoading(true);
    const fetchMovies = async () => {
      try {
        const searchRes = await fetch(
          `http://www.omdbapi.com/?apikey=${API_KEY}&s=${SEARCH_QUERY}&page=${page}`
        );
        const searchData = await searchRes.json();
        if (searchData.Response === "True") {
          // For each movie, fetch detailed information (for description, rating, and release date)
          const movies = await Promise.all(
            searchData.Search.map(async (movie) => {
              const detailRes = await fetch(
                `http://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`
              );
              const detailData = await detailRes.json();
              return {
                id: movie.imdbID,
                image: detailData.Poster !== "N/A" ? detailData.Poster : "",
                description: detailData.Plot,
                date: detailData.Released,
                number: detailData.imdbRating,
              };
            })
          );
          setRows(movies);
           setTotalResults(Number(searchData.totalResults));
        } else {
          console.error("Error fetching movies:", searchData.Error);
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
      setLoading(false);
    };

    fetchMovies();
  }, []);

  const columns = [
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
              contentFit: "contain",
              cursor: "pointer",
              marginTop: "10px",
            }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(params.value);
              setOpenImageModal(true);
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
            color: "black",
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
          style={{ fontWeight: "bold", color: "#f50057", cursor: "pointer" }}
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
        <Typography style={{ color: "#4caf50", cursor: "pointer" }}>
          {params.value}
        </Typography>
      ),
    },
  ];

  const handleRowClick = (params) => {
    setSelectedRow(params.row);
    setOpenRowModal(true);
  };

  const handleCloseRowModal = () => {
    setOpenRowModal(false);
  };

  const handleCloseImageModal = () => {
    setOpenImageModal(false);
  };

  const getRowHeight = (params) => {
    const descriptionLength = params.model?.description
      ? params.model.description.length
      : 0;
    const height = descriptionLength * 1.25;
    return height < 100 ? 100 : height > 300 ? 300 : height;
  };

  return (
    <div style={{ width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        sortingOrder={["asc", "desc"]}
        sortModel={sortModel}
        onSortModelChange={(model) => setSortModel(model)}
        filterModel={filterModel}
        onFilterModelChange={(model) => setFilterModel(model)}
        onRowClick={handleRowClick}
        getRowHeight={getRowHeight}
        paginationModel={{ page: page - 1, pageSize: ITEMS_PER_PAGE }} // Convert to zero-based index
        onPaginationModelChange={(model) => setPage(model.page + 1)} // Convert back to 1-based index
        pageSizeOptions={[ITEMS_PER_PAGE]}
        loading={loading}
      />

      {/* Movie Details Modal */}
      <Dialog
        open={openRowModal}
        onClose={handleCloseRowModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Movie Details</DialogTitle>
        <DialogContent dividers>
          {selectedRow && (
            <>
              <Typography variant="body1">
                <strong>Description:</strong> {selectedRow.description}
              </Typography>
              <Typography variant="body1">
                <strong>Release Date:</strong> {selectedRow.date}
              </Typography>
              <Typography variant="body1">
                <strong>Rating:</strong> {selectedRow.number}
              </Typography>
              {selectedRow.image && (
                <img
                  src={selectedRow.image}
                  alt="poster"
                  style={{
                    width: "100%",
                    marginTop: "16px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setSelectedImage(selectedRow.image);
                    setOpenImageModal(true);
                  }}
                />
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Poster Modal */}
      <Dialog
        open={openImageModal}
        onClose={handleCloseImageModal}
        maxWidth="md"
      >
        <img
          src={selectedImage}
          alt="enlarged poster"
          style={{ width: "100%", height: "auto" }}
        />
      </Dialog>
    </div>
  );
}

export default DataTable;
