import type { IEmployee } from "src/types/employee";

import { useState, useCallback } from "react";

import {
  Box,
  Dialog,
  Button,
  IconButton,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import { useAppDispatch } from "src/hooks/useAppDispatch";

import { setModal } from "src/store/slices/modalSlice";
import { deleteEmployes } from "src/store/actions/employeeActions";

import { Iconify } from "src/components/iconify";

export default function ActionEmployee({ employee }: { employee: IEmployee }) {
  const dispatch = useAppDispatch();
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleSelect = useCallback(() => {
    dispatch(
      setModal({
        modal: "employeeModal",
        data: { type: "edit", data: employee },
      })
    );
  }, [dispatch, employee]);

  const handleDelete = useCallback(() => {
    dispatch(deleteEmployes(employee._id));
    setOpenConfirm(false);
  }, [dispatch, employee]);

  return (
    <Box>
      <IconButton onClick={handleSelect}>
        <Iconify icon="solar:pen-bold" />
      </IconButton>

      <IconButton onClick={() => setOpenConfirm(true)} color="error">
        <Iconify icon="solar:trash-bin-trash-bold" />
      </IconButton>

      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>O‘chirishni tasdiqlang</DialogTitle>
        <DialogContent>
          <Typography>
            Haqiqatan ham <b>{employee.fullName}</b> xodimini o‘chirmoqchimisiz?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)} color="inherit">
            Bekor qilish
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            O‘chirish
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
