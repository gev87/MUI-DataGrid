import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, CardMedia, Dialog } from "@mui/material";
import Columns from "../Columns";
import { API } from "../../constants";
import DetailsDialog from "../DetailsDialog";
import styles from "./DataTable.module.css";

function DataTable() {
  const [rows, setRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [page, setPage] = useState(+localStorage.getItem("page") || 1);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  const [sortModel, setSortModel] = useState(() => {
    const saved = localStorage.getItem("sortModel");
    return saved ? JSON.parse(saved) : [];
  });
  const [filterModel, setFilterModel] = useState(() => {
    const saved = localStorage.getItem("filterModel");
    return saved ? JSON.parse(saved) : { items: [] };
  });

  const getRowHeight = (params) => {
    const descriptionLength = params.model?.description
      ? params.model.description.length
      : 0;
    const height = descriptionLength * 1.35;
    return height < 100 ? 100 : height > 300 ? 300 : height;
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

  useEffect(() => {
    setLoading(true);
    const fetchMovies = async () => {
      try {
        const searchRes = await fetch(
          `${API.base}/?apikey=${API.key}&s=${API.searchQuery}&page=${page}`
        );
        const searchData = await searchRes.json();
        if (searchData.Response === "True") {
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
    <Box className={styles.container}>
      <DataGrid
        rows={rows}
        columns={Columns({ onImageClick: (image) => setSelectedImage(image) })}
        rowsPerPageOptions={[API.step]}
        sortingOrder={["asc", "desc"]}
        sortModel={sortModel}
        onSortModelChange={(model) => setSortModel(model)}
        filterModel={filterModel}
        onFilterModelChange={(model) => setFilterModel(model)}
        onRowClick={(params) => setSelectedRow(params.row)}
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
      {!!selectedRow && (
        <DetailsDialog {...selectedRow} onClose={() => setSelectedRow(null)} />
      )}
      {!!selectedImage && (
        <Dialog open onClose={() => setSelectedImage("")} maxWidth="md">
          <CardMedia
            component="img"
            src={selectedImage}
            alt="enlarged poster"
            className={styles.poster}
          />
        </Dialog>
      )}
    </Box>
  );
}

export default DataTable;
