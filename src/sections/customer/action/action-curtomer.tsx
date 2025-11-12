import type { ICustomer } from "src/types/customer";

import { useState, useCallback } from "react";

import { IconButton } from "@mui/material";
import Popover from "@mui/material/Popover";
import MenuList from "@mui/material/MenuList";
import MenuItem, { menuItemClasses } from "@mui/material/MenuItem";

import { useAppDispatch } from "src/hooks/useAppDispatch";

import { setModal } from "src/store/slices/modalSlice";
import {
  deleteCustomer,
  restorationCustomer,
} from "src/store/actions/customerActions";

import { Iconify } from "src/components/iconify";

export default function ActionCustomer({ customer }: { customer: ICustomer }) {
  const dispatch = useAppDispatch();
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(
    null
  );

  const handleOpenPopover = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setOpenPopover(event.currentTarget);
    },
    []
  );

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleSelect = useCallback(() => {
    dispatch(
      setModal({
        modal: "customerModal",
        data: { type: "edit", data: customer },
      })
    );
    handleClosePopover();
  }, [dispatch, customer, handleClosePopover]);

  const handleDelete = useCallback(
    (id: string) => {
      dispatch(deleteCustomer(id));
      handleClosePopover();
    },
    [dispatch, handleClosePopover]
  );

  const restorationDelete = useCallback(
    (id: string) => {
      dispatch(restorationCustomer(id));
      handleClosePopover();
    },
    [dispatch, handleClosePopover]
  );
  return (
    <>
      <IconButton onClick={handleOpenPopover}>
        <Iconify icon="eva:more-vertical-fill" />
      </IconButton>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: "flex",
            flexDirection: "column",
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: "action.selected" },
            },
          }}
        >
          <MenuItem onClick={handleSelect}>
            <Iconify icon="solar:pen-bold" />
            Tahrirlash
          </MenuItem>
          {!customer.isDeleted && (
            <MenuItem
              onClick={() => handleDelete(customer._id)}
              sx={{ color: "error.main" }}
            >
              <Iconify icon="solar:trash-bin-trash-bold" />
              O`chirish
            </MenuItem>
          )}
          {customer.isDeleted && (
            <MenuItem
              onClick={() => restorationDelete(customer._id)}
              sx={{ color: "success.main" }}
            >
              <Iconify icon="solar:refresh-circle-linear" />
              Tiklash
            </MenuItem>
          )}
        </MenuList>
      </Popover>
    </>
  );
}
