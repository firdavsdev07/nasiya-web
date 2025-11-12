import {
  Dialog,
  Button,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
} from "@mui/material";

const PayCommentModal = ({
  open,
  onClose,
}: {
  open: string;
  onClose: () => void;
}) => {
  console.log("ff",);
  
  return(<Dialog open={open !== ""} onClose={onClose}>
    <DialogTitle>To`lov izohi</DialogTitle>
    <DialogContent>
      <Typography>{open}</Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Yopish</Button>
    </DialogActions>
  </Dialog>)
};

export default PayCommentModal;
