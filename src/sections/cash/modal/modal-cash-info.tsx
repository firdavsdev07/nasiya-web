import type { RootState } from "src/store";

import { useSelector } from "react-redux";
import { useState, useEffect, useCallback } from "react";

import {
  Chip,
  List,
  Stack,
  Button,
  Dialog,
  Avatar,
  Divider,
  ListItem,
  Typography,
  DialogTitle,
  ListItemText,
  DialogActions,
  DialogContent,
  CircularProgress,
} from "@mui/material";

import { useAppDispatch } from "src/hooks/useAppDispatch";

import authApi from "src/server/auth";
import { closeModal } from "src/store/slices/modalSlice";

const ModalCashInfo = () => {
  const dispatch = useAppDispatch();

  const { cashInfoModal } = useSelector((state: RootState) => state.modal);

  const [contract, setContract] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Get payment data from modal
  const payment = cashInfoModal?.data as any;

  // Extract contractId from payment
  const contractId = payment?.contractId;

  const handleClose = useCallback(() => {
    dispatch(closeModal("cashInfoModal"));
    setContract(null);
  }, [dispatch]);

  useEffect(() => {
    console.log("🔍 === MODAL OPENED ===");
    console.log("🔍 Payment data:", payment);
    console.log("🔍 Contract ID:", contractId);

    if (!contractId) {
      console.log("⚠️ No contract ID found in payment");
      return;
    }

    const fetchContract = async () => {
      try {
        setLoading(true);
        const res = await authApi.get(
          `/contract/get-contract-by-id/${contractId}`
        );
        console.log("✅ Contract data:", res.data);
        setContract(res.data);
      } catch (error: any) {
        console.error("❌ Error fetching contract:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContract();
  }, [contractId, cashInfoModal]);

  return (
    <Dialog
      open={!!cashInfoModal?.type}
      maxWidth="md"
      fullWidth
      onClose={handleClose}
    >
      <DialogTitle>Shartnoma Ma'lumotlari</DialogTitle>
      <DialogContent>
        {loading ? (
          <Stack alignItems="center" justifyContent="center" p={4}>
            <CircularProgress />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Shartnoma ma'lumotlari yuklanmoqda...
            </Typography>
          </Stack>
        ) : !contract ? (
          <Stack alignItems="center" justifyContent="center" p={4}>
            <Typography variant="body1" color="text.secondary">
              Shartnoma ma'lumotlari topilmadi
            </Typography>
          </Stack>
        ) : (
          <Stack spacing={3} sx={{ mt: 2 }}>
            {/* Mijoz ma'lumotlari */}
            <Stack spacing={1}>
              <Typography variant="subtitle2" color="text.secondary">
                Mijoz
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ width: 40, height: 40 }} />
                <Typography variant="body1">
                  {contract?.customer?.firstName} {contract?.customer?.lastName}
                </Typography>
              </Stack>
            </Stack>

            <Divider />

            {/* ✅ TO'LOV HOLATI MA'LUMOTLARI */}
            {payment && (
              <Stack spacing={2} sx={{ p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold">
                  To'lov Ma'lumotlari
                </Typography>
                
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Kutilgan summa:
                  </Typography>
                  <Typography variant="body2" fontWeight="600">
                    {payment.expectedAmount?.toLocaleString() || "0"} $
                  </Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    To'langan summa:
                  </Typography>
                  <Typography variant="body2" fontWeight="600">
                    {payment.amount?.toLocaleString() || "0"} $
                  </Typography>
                </Stack>

                {/* Kam to'langan */}
                {payment.status === "UNDERPAID" && payment.remainingAmount > 0 && (
                  <Stack 
                    direction="row" 
                    justifyContent="space-between"
                    sx={{ 
                      p: 1.5, 
                      bgcolor: "error.lighter", 
                      borderRadius: 1,
                      border: 1,
                      borderColor: "error.main"
                    }}
                  >
                    <Typography variant="body2" color="error.main" fontWeight="600">
                      ⚠️ Kam to'langan:
                    </Typography>
                    <Typography variant="body2" color="error.main" fontWeight="bold">
                      {payment.remainingAmount.toFixed(2)} $
                    </Typography>
                  </Stack>
                )}

                {/* Ko'p to'langan */}
                {payment.status === "OVERPAID" && payment.excessAmount > 0 && (
                  <Stack 
                    direction="row" 
                    justifyContent="space-between"
                    sx={{ 
                      p: 1.5, 
                      bgcolor: "info.lighter", 
                      borderRadius: 1,
                      border: 1,
                      borderColor: "info.main"
                    }}
                  >
                    <Typography variant="body2" color="info.main" fontWeight="600">
                      💰 Ko'p to'langan:
                    </Typography>
                    <Typography variant="body2" color="info.main" fontWeight="bold">
                      {payment.excessAmount.toFixed(2)} $
                    </Typography>
                  </Stack>
                )}

                {/* Prepaid balance */}
                {payment.prepaidAmount > 0 && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Keyingi oyga o'tkazildi:
                    </Typography>
                    <Typography variant="body2" fontWeight="600" color="success.main">
                      {payment.prepaidAmount.toFixed(2)} $
                    </Typography>
                  </Stack>
                )}

                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Holat:
                  </Typography>
                  <Chip
                    label={
                      payment.status === "PAID" ? "✅ To'langan" :
                      payment.status === "UNDERPAID" ? "⚠️ Kam to'langan" :
                      payment.status === "OVERPAID" ? "💰 Ko'p to'langan" :
                      payment.status === "PENDING" ? "⏳ Kutilmoqda" :
                      payment.status === "REJECTED" ? "❌ Rad etilgan" :
                      payment.status
                    }
                    color={
                      payment.status === "PAID" ? "success" :
                      payment.status === "UNDERPAID" ? "error" :
                      payment.status === "OVERPAID" ? "info" :
                      payment.status === "PENDING" ? "warning" :
                      "default"
                    }
                    size="small"
                  />
                </Stack>
              </Stack>
            )}

            <Divider />

            {/* Shartnoma ma'lumotlari */}
            <List dense>
              <ListItem>
                <ListItemText
                  primary="Mahsulot nomi"
                  secondary={contract?.productName || "___"}
                />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText
                  primary="Umumiy narx"
                  secondary={`${contract?.totalPrice?.toLocaleString() || "0"} $`}
                />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText
                  primary="Boshlang'ich to'lov"
                  secondary={`${contract?.initialPayment?.toLocaleString() || "0"} $`}
                />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText
                  primary="Oylik to'lov"
                  secondary={`${contract?.monthlyPayment?.toLocaleString() || "0"} $`}
                />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText
                  primary="Muddat"
                  secondary={
                    contract?.duration 
                      ? `${contract.duration} oy` 
                      : contract?.period
                      ? `${contract.period} oy`
                      : "___"
                  }
                />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText
                  primary="Boshlanish sanasi"
                  secondary={
                    contract?.startDate
                      ? new Date(contract.startDate).toLocaleDateString("uz-UZ")
                      : "___"
                  }
                />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText
                  primary="Tugash sanasi"
                  secondary={(() => {
                    if (contract?.endDate) {
                      try {
                        return new Date(contract.endDate).toLocaleDateString("uz-UZ");
                      } catch (e) {
                        console.error("Invalid endDate:", contract.endDate);
                      }
                    }
                    
                    if (contract?.startDate && (contract?.period || contract?.duration)) {
                      try {
                        const startDate = new Date(contract.startDate);
                        const months = contract.period || contract.duration;
                        
                        if (!isNaN(startDate.getTime()) && months) {
                          const endDate = new Date(startDate);
                          endDate.setMonth(endDate.getMonth() + months);
                          return endDate.toLocaleDateString("uz-UZ");
                        }
                      } catch (e) {
                        console.error("Error calculating endDate:", e);
                      }
                    }
                    
                    return "___";
                  })()}
                />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText
                  primary="Holat"
                  secondary={
                    <Chip
                      label={contract?.status || "___"}
                      color={
                        contract?.status === "ACTIVE" ? "success" : "default"
                      }
                      size="small"
                    />
                  }
                />
              </ListItem>
            </List>
          </Stack>
        )}
      </DialogContent>

      <DialogActions>
        <Button color="error" onClick={handleClose}>
          Yopish
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalCashInfo;
