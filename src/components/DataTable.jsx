// src/DataTable.jsx
import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Dialog, DialogTitle, DialogContent, Typography } from "@mui/material";
import Columns from "./Columns";
import { API } from "../constants";

function DataTable() {
  const [rows, setRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openRowModal, setOpenRowModal] = useState(false);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [page, setPage] = useState(+localStorage.getItem("page") || 1); // Current page number
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

  const onImageClick = (image) => {
    setSelectedImage(image);
    setOpenImageModal(true);
  };

  useEffect(() => {
    localStorage.setItem("sortModel", JSON.stringify(sortModel));
  }, [sortModel]);

  useEffect(() => {
    localStorage.setItem("filterModel", JSON.stringify(filterModel));
  }, [filterModel]);

  useEffect(() => {
    localStorage.setItem("page", JSON.stringify(page));
  }, [page]);

  // Fetch movies from OMDb API using a default search query.
  useEffect(() => {
    setLoading(true);
    const fetchMovies = async () => {
      try {
        const searchRes = await fetch(
          `${API.base}/?apikey=${API.key}&s=${API.searchQuery}&page=${page}`
        );
        const searchData = await searchRes.json();
        if (searchData.Response === "True") {
          // For each movie, fetch detailed information (for description, rating, and release date)
          const movies = await Promise.all(
            searchData.Search.map(async (movie) => {
              const detailRes = await fetch(
                `${API.base}/?apikey=${API.key}&i=${movie.imdbID}`
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
  }, [page]);

  return (
    <div style={{ width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={Columns({ onImageClick })}
        rowsPerPageOptions={[API.step]}
        sortingOrder={["asc", "desc"]}
        sortModel={sortModel}
        onSortModelChange={(model) => setSortModel(model)}
        filterModel={filterModel}
        onFilterModelChange={(model) => setFilterModel(model)}
        onRowClick={handleRowClick}
        getRowHeight={getRowHeight}
        paginationModel={{ page: page - 1, pageSize: API.step }}
        onPaginationModelChange={(model) => setPage(model.page + 1)}
        pageSizeOptions={[API.step]}
        pageSize={API.step}
        loading={loading}
        onPageChange={(newPage) => setPage(newPage + 1)}
        rowCount={totalResults}
        paginationMode="server"
      />

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
