import type { RootState } from "src/store";
import type { IPayment } from "src/types/cash";

import { useCallback } from "react";
import { useSelector } from "react-redux";

import { Stack, IconButton, Tooltip } from "@mui/material";

import { useAppDispatch } from "src/hooks/useAppDispatch";

import { setModal } from "src/store/slices/modalSlice";

import { Iconify } from "src/components/iconify";

export default function ActionCash({ cash }: { cash: IPayment }) {
  const dispatch = useAppDispatch();
  const { profile } = useSelector((state: RootState) => state.auth);

  // Seller'dan boshqa barcha role'lar rad etishi mumkin
  const canRejectPayments = profile.role !== "seller" && profile.role !== null;

  const handleSelect = useCallback(() => {
    console.log("👁️ View button clicked, cash:", cash);
    dispatch(
      setModal({
        modal: "cashInfoModal",
        data: { type: "info", data: cash }, // ModalData structure
      })
    );
  }, [dispatch, cash]);

  const handleReject = useCallback(() => {
    if (!canRejectPayments) {
      return;
    }
    dispatch(
      setModal({
        modal: "cashRejectModal",
        data: { type: "reject", data: cash },
      })
    );
  }, [dispatch, cash, canRejectPayments]);

  return (
    <Stack direction="row" spacing={0.5}>
      {/* Ma'lumot ko'rish tugmasi */}
      <Tooltip title="Ma'lumot">
        <IconButton onClick={handleSelect} size="small">
          <Iconify icon="solar:eye-bold" />
        </IconButton>
      </Tooltip>

      {/* Rad etish tugmasi */}
      {canRejectPayments && (
        <Tooltip title="Rad etish">
          <IconButton onClick={handleReject} size="small" color="error">
            <Iconify icon="solar:close-circle-bold" />
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  );
}
