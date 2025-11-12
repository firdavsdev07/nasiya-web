import type { FC } from "react";

import { useState, useEffect } from "react";

import {
  Box,
  Alert,
  Button,
  Dialog,
  TextField,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
  InputAdornment,
} from "@mui/material";

import authApi from "src/server/auth";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { enqueueSnackbar } from "src/store/slices/snackbar";

interface PaymentModalProps {
  open: boolean;
  amount: number;
  contractId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentModal: FC<PaymentModalProps> = ({
  open,
  amount,
  contractId,
  onClose,
  onSuccess,
}) => {
  const dispatch = useAppDispatch();
  const [note, setNote] = useState("");
  const [dollarAmount, setDollarAmount] = useState(amount);
  const [sumAmount, setSumAmount] = useState(0);
  const [currencyCourse, setCurrencyCourse] = useState(12500);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Currency course olish
  useEffect(() => {
    const fetchCurrencyCourse = async () => {
      try {
        const res = await authApi.get("/dashboard/currency-course");
        if (res.data && res.data.course) {
          setCurrencyCourse(res.data.course);
        }
      } catch (error) {
        console.error("Error fetching currency course:", error);
      }
    };

    if (open) {
      fetchCurrencyCourse();
      setDollarAmount(amount);
      setSumAmount(amount * currencyCourse);
    }
  }, [open, amount, currencyCourse]);

  // Raqamni formatlash funksiyasi
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(num);
  };

  // Formatni olib tashlash funksiyasi
  const parseFormattedNumber = (str: string): number => {
    const cleaned = str.replace(/,/g, "");
    return parseFloat(cleaned) || 0;
  };

  const handleDollarChange = (value: string) => {
    const numValue = parseFormattedNumber(value);
    setDollarAmount(numValue);
    setSumAmount(numValue * currencyCourse);
  };

  const handleSumChange = (value: string) => {
    const numValue = parseFormattedNumber(value);
    setSumAmount(numValue);
    setDollarAmount(numValue / currencyCourse);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      // Contract bo'yicha to'lov qilish
      const paymentData = {
        contractId,
        amount: dollarAmount,
        notes: note,
        currencyDetails: {
          dollar: dollarAmount,
          sum: sumAmount,
        },
        currencyCourse,
      };

      console.log("Sending payment data:", paymentData);

      const res = await authApi.post("/payment/contract", paymentData);

      // ✅ Backend'dan kelgan to'lov holati ma'lumotlarini ko'rsatish
      const paymentDetails = res.data.paymentDetails;
      let notificationMessage = res.data.message || "To'lov muvaffaqiyatli amalga oshirildi";
      let notificationVariant: "success" | "warning" | "info" = "success";

      if (paymentDetails) {
        if (paymentDetails.status === "UNDERPAID") {
          notificationVariant = "warning";
          notificationMessage = `⚠️ ${notificationMessage}\nQolgan qarz: ${paymentDetails.remainingAmount.toFixed(2)} $`;
        } else if (paymentDetails.status === "OVERPAID") {
          notificationVariant = "info";
          notificationMessage = `✅ ${notificationMessage}\nOrtiqcha summa: ${paymentDetails.excessAmount.toFixed(2)} $ (keyingi oyga o'tkazildi)`;
        }
      }

      dispatch(
        enqueueSnackbar({
          message: notificationMessage,
          options: { variant: notificationVariant },
        })
      );

      // Modal'ni yopish va ma'lumotlarni tozalash
      onClose();
      setNote("");

      // Backend'da ma'lumotlar yangilanishi uchun biroz kutamiz
      setTimeout(() => {
        onSuccess();
      }, 1000);
    } catch (err: any) {
      console.error("Payment error:", err);
      const errorMessage =
        err.response?.data?.message || "To'lov amalga oshirilmadi";

      setError(errorMessage);

      dispatch(
        enqueueSnackbar({
          message: errorMessage,
          options: { variant: "error" },
        })
      );
    } finally {
      setLoading(false);
    }
  };

  // Real-time hisoblash
  const difference = dollarAmount - amount;
  const isUnderpaid = difference < -0.01;
  const isOverpaid = difference > 0.01;
  const isExact = Math.abs(difference) <= 0.01;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>To'lovni tasdiqlash</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          {error && (
            <Alert severity="error" onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          {/* Oylik to'lov ma'lumoti */}
          <Box
            sx={{
              p: 2,
              bgcolor: "grey.100",
              borderRadius: 1,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Oylik to'lov:
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {amount.toLocaleString()} $
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="Dollar"
            value={formatNumber(dollarAmount)}
            onChange={(e) => handleDollarChange(e.target.value)}
            InputProps={{
              endAdornment: <InputAdornment position="end">$</InputAdornment>,
            }}
          />

          <TextField
            fullWidth
            label="So'm"
            value={formatNumber(sumAmount)}
            onChange={(e) => handleSumChange(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">so'm</InputAdornment>
              ),
            }}
          />

          <Box
            sx={{
              p: 2,
              bgcolor: "background.neutral",
              borderRadius: 1,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Kurs: 1$ = {currencyCourse.toLocaleString()} so'm
            </Typography>
          </Box>

          {/* Real-time hisoblash natijasi */}
          {dollarAmount > 0 && (
            <Box>
              {/* Kam to'langan */}
              {isUnderpaid && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    ⚠️ Kam to'layapsiz
                  </Typography>
                  <Typography variant="body2">
                    Yana <strong>{Math.abs(difference).toFixed(2)} $</strong> to'lashingiz kerak
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    To'layotgan: {dollarAmount.toFixed(2)} $ | Kerak: {amount.toFixed(2)} $
                  </Typography>
                </Alert>
              )}

              {/* Ko'p to'langan */}
              {isOverpaid && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    ✅ Ko'p to'layapsiz
                  </Typography>
                  <Typography variant="body2">
                    <strong>{difference.toFixed(2)} $</strong> ortiqcha to'layapsiz
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Bu summa keyingi oyga o'tkaziladi
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    To'layotgan: {dollarAmount.toFixed(2)} $ | Kerak: {amount.toFixed(2)} $
                  </Typography>
                </Alert>
              )}

              {/* To'g'ri to'langan */}
              {isExact && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    ✓ To'g'ri summa
                  </Typography>
                  <Typography variant="body2">
                    Oylik to'lovga to'liq mos keladi
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    To'layotgan: {dollarAmount.toFixed(2)} $ = Kerak: {amount.toFixed(2)} $
                  </Typography>
                </Alert>
              )}
            </Box>
          )}

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Izoh (ixtiyoriy)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="To'lov haqida qo'shimcha ma'lumot..."
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Bekor qilish
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || dollarAmount <= 0}
        >
          {loading ? "Yuklanmoqda..." : "Tasdiqlash"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentModal;
