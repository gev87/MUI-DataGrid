import {
  CardMedia,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import styles from "./DetailsDialog.module.css";

function DetailsDialog({ onClose, image, description, date, number }) {
  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Movie Details</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1">
          <strong>Description:</strong> {description}
        </Typography>
        <Typography variant="body1">
          <strong>Release Date:</strong> {date}
        </Typography>
        <Typography variant="body1">
          <strong>Rating:</strong> {number}
        </Typography>
        <CardMedia
          component="img"
          className={styles.image}
          src={image}
          alt="poster"
        />
      </DialogContent>
    </Dialog>
  );
}
export default DetailsDialog;
