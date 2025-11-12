import type { RootState } from "src/store";

import { useSelector } from "react-redux";
import { useState, useCallback } from "react";

import { green } from "@mui/material/colors";
import Grid from "@mui/material/Unstable_Grid2";
import {
  Button,
  Dialog,
  TextField,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
} from "@mui/material";

import { useAppDispatch } from "src/hooks/useAppDispatch";

import { closeModal } from "src/store/slices/modalSlice";
import { changeCurrency } from "src/store/actions/dashboardActions";

const ModalCurrency = () => {
  const dispatch = useAppDispatch();
  const { dashboardModal } = useSelector((state: RootState) => state.modal);

  const [newCurrency, setCurrency] = useState<number>(0);

  const handleNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      const numValue = value === "" ? 0 : Number(value.replace(/\D/g, ""));

      setCurrency(numValue);
    },
    []
  );

  const handleClose = useCallback(() => {
    setCurrency(0);
    dispatch(closeModal("dashboardModal"));
  }, [dispatch]);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (newCurrency > 0) {
        dispatch(changeCurrency(newCurrency));
        handleClose();
      }
    },
    [dispatch, handleClose, newCurrency]
  );

  return (
    <Dialog
      open={!!dashboardModal?.type}
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
      }}
    >
      <DialogTitle sx={{ display: "flex", gap: 3, alignItems: "center" }}>
        Joriy kurs{" "}
        <Typography variant="h5" fontWeight={700} color={green[400]}>
          {dashboardModal.data}$
        </Typography>{" "}
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2}>
          <Grid
            xs={12}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <a
              href="https://bank.uz/currency/cb.html"
              title="Bank.uz - O'zbekiston banklari to'g'risida barcha ma'lumotlar"
              target="_blank"
              rel="noreferrer"
              style={{ height: "100px" }}
            >
              <img
                src="https://bank.uz/scripts/informer"
                alt="Dollar kursi"
                style={{
                  maxWidth: "100%",
                  height: "100%",
                  borderRadius: 8,
                }}
              />
            </a>
          </Grid>

          <Grid xs={12}>
            <TextField
              value={newCurrency}
              onChange={handleNumberChange}
              margin="dense"
              id="currency"
              name="currency"
              label="USD"
              fullWidth
              inputProps={{ min: 0 }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button color="error" onClick={handleClose}>
          Bekor qilish
        </Button>
        <Button type="submit" color="success" disabled={newCurrency <= 0}>
          Saqlash
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalCurrency;
