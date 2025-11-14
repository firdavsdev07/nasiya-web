import type { FC } from "react";

import { useState, useEffect, useRef } from "react";

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
  isPayAll?: boolean;
  paymentId?: string; // ✅ Qolgan qarzni to'lash uchun
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentModal: FC<PaymentModalProps> = ({
  open,
  amount,
  contractId,
  isPayAll = false,
  paymentId, // ✅ Qolgan qarzni to'lash uchun
  onClose,
  onSuccess,
}) => {
  const dispatch = useAppDispatch();
  const dollarInputRef = useRef<HTMLInputElement>(null);
  const [note, setNote] = useState("");
  const [dollarAmount, setDollarAmount] = useState(amount);
  const [sumAmount, setSumAmount] = useState(0);
  const [currencyCourse, setCurrencyCourse] = useState(12500);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Currency course olish va input'larni to'ldirish
  useEffect(() => {
    const fetchCurrencyCourse = async () => {
      try {
        const res = await authApi.get("/dashboard/currency-course");
        if (res.data && res.data.course) {
          const course = res.data.course;
          setCurrencyCourse(course);
          
          // Input'larni to'ldirish
          const dollarValue = amount;
          const sumValue = amount * course;
          
          setDollarAmount(dollarValue);
          setSumAmount(sumValue);
          setDollarInput(dollarValue.toFixed(2));
          setSumInput(sumValue.toFixed(0));
          
          // Input'ga focus qilish va select qilish
          setTimeout(() => {
            if (dollarInputRef.current) {
              dollarInputRef.current.focus();
              dollarInputRef.current.select();
            }
          }, 100);
        }
      } catch (error) {
        console.error("Error fetching currency course:", error);
        // Agar xato bo'lsa, default qiymatdan foydalanish
        const course = 12500;
        const dollarValue = amount;
        const sumValue = amount * course;
        
        setCurrencyCourse(course);
        setDollarAmount(dollarValue);
        setSumAmount(sumValue);
        setDollarInput(dollarValue.toFixed(2));
        setSumInput(sumValue.toFixed(0));
        
        // Input'ga focus qilish va select qilish
        setTimeout(() => {
          if (dollarInputRef.current) {
            dollarInputRef.current.focus();
            dollarInputRef.current.select();
          }
        }, 100);
      }
    };

    if (open) {
      fetchCurrencyCourse();
    }
  }, [open, amount]);

  // State'lar input qiymatlari uchun (string)
  const [dollarInput, setDollarInput] = useState(amount.toFixed(2));
  const [sumInput, setSumInput] = useState((amount * currencyCourse).toFixed(0));

  // Raqamni formatlash funksiyasi (faqat ko'rsatish uchun)
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(num);
  };

  // Input qiymatini parse qilish (nuqta va vergulni qo'llab-quvvatlaydi)
  const parseInputNumber = (str: string): number => {
    // Faqat raqamlar, nuqta va vergulni qoldirish
    const cleaned = str.replace(/[^\d.,]/g, "");
    // Vergulni nuqtaga almashtirish
    const normalized = cleaned.replace(/,/g, "");
    return parseFloat(normalized) || 0;
  };

  const handleDollarChange = (value: string) => {
    // Faqat raqamlar va nuqtani qabul qilish
    if (value === "" || /^[\d.]*$/.test(value)) {
      setDollarInput(value);
      const numValue = parseInputNumber(value);
      setDollarAmount(numValue);
      setSumAmount(numValue * currencyCourse);
    }
  };

  const handleSumChange = (value: string) => {
    // Faqat raqamlar va nuqtani qabul qilish
    if (value === "" || /^[\d.]*$/.test(value)) {
      setSumInput(value);
      const numValue = parseInputNumber(value);
      setSumAmount(numValue);
      setDollarAmount(numValue / currencyCourse);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      // Validatsiya - barcha maydonlar to'ldirilganligini tekshirish
      if (!contractId) {
        setError("Contract ID topilmadi");
        setLoading(false);
        return;
      }

      if (!dollarAmount || dollarAmount <= 0) {
        setError("To'lov summasi noto'g'ri");
        setLoading(false);
        return;
      }

      if (!currencyCourse || currencyCourse <= 0) {
        setError("Valyuta kursi yuklanmadi. Iltimos, qayta urinib ko'ring.");
        setLoading(false);
        return;
      }

      // Contract bo'yicha to'lov qilish
      const paymentData = {
        contractId,
        amount: dollarAmount,
        notes: note || "",
        currencyDetails: {
          dollar: dollarAmount,
          sum: sumAmount,
        },
        currencyCourse,
      };

      console.log("✅ Sending payment data:", paymentData, "isPayAll:", isPayAll);
      console.log("✅ Validation check:", {
        hasContractId: !!paymentData.contractId,
        hasAmount: !!paymentData.amount,
        hasCurrencyDetails: !!paymentData.currencyDetails,
        hasCurrencyCourse: !!paymentData.currencyCourse,
        currencyCourseValue: paymentData.currencyCourse,
        dollarAmount,
        sumAmount,
      });

      // ✅ Endpoint tanlash
      let endpoint = "/payment/contract";
      let requestData: any = paymentData;

      if (isPayAll) {
        endpoint = "/payment/pay-all-remaining";
      } else if (paymentId) {
        // ✅ TEMPORARY FIX: /payment/contract endpoint'dan foydalanish
        // paymentId ni notes'ga qo'shamiz, backend'da tekshiramiz
        endpoint = "/payment/contract";
        requestData = {
          ...paymentData,
          notes: `[PAY_REMAINING:${paymentId}] ${note || ""}`,
        };
        console.log("💰 Paying remaining for payment (via /contract):", paymentId);
        console.log("📝 Notes with PAY_REMAINING tag:", requestData.notes);
      }

      console.log("📡 Sending to endpoint:", endpoint);
      console.log("📦 Request data:", requestData);
      const res = await authApi.post(endpoint, requestData);

      // ✅ Backend'dan kelgan to'lov holati ma'lumotlarini ko'rsatish
      let notificationMessage = res.data.message || "To'lov muvaffaqiyatli amalga oshirildi";
      let notificationVariant: "success" | "warning" | "info" = "success";

      // Agar "Barchasini to'lash" bo'lsa
      if (isPayAll) {
        notificationMessage = res.data.message || `${res.data.paymentsCreated} oylik to'lovlar muvaffaqiyatli amalga oshirildi`;
      } 
      // Agar qolgan qarzni to'lash bo'lsa
      else if (paymentId) {
        // payRemaining response
        const payment = res.data.payment;
        if (payment) {
          if (payment.status === "PAID" && payment.isPaid) {
            notificationVariant = "success";
            notificationMessage = "✅ Qolgan qarz to'liq to'landi!";
          } else if (payment.remainingAmount > 0) {
            notificationVariant = "warning";
            notificationMessage = `⚠️ Qolgan qarz qisman to'landi.\nHali ${payment.remainingAmount.toFixed(2)} $ qoldi`;
          }
        }
      }
      // Oddiy to'lov uchun
      else {
        const paymentDetails = res.data.paymentDetails;
        if (paymentDetails) {
          if (paymentDetails.status === "UNDERPAID") {
            notificationVariant = "warning";
            notificationMessage = `⚠️ ${notificationMessage}\nQolgan qarz: ${paymentDetails.remainingAmount.toFixed(2)} $`;
          } else if (paymentDetails.status === "OVERPAID") {
            notificationVariant = "info";
            notificationMessage = `✅ ${notificationMessage}\nOrtiqcha summa: ${paymentDetails.excessAmount.toFixed(2)} $ (keyingi oyga o'tkazildi)`;
          }
        }
      }

      dispatch(
        enqueueSnackbar({
          message: notificationMessage,
          options: { variant: notificationVariant },
        })
      );

      // Modal'ni yopish va ma'lumotlarni tozalash
      setNote("");
      setDollarInput("");
      setSumInput("");
      onClose();

      // Backend'da ma'lumotlar yangilanishi uchun biroz kutamiz
      setTimeout(() => {
        onSuccess();
      }, 1000);
    } catch (err: any) {
      console.error("Payment error:", err);
      console.error("Error response:", err.response);
      console.error("Error response data:", err.response?.data);
      
      const errorMessage =
        err.response?.data?.message || err.message || "To'lov amalga oshirilmadi";

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
      <DialogTitle>{isPayAll ? "Barcha oylarni to'lash" : "To'lovni tasdiqlash"}</DialogTitle>
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
              bgcolor: isPayAll ? "success.lighter" : "grey.100",
              borderRadius: 1,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              {isPayAll ? "Qolgan qarz:" : "Oylik to'lov:"}
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {amount.toLocaleString()} $
            </Typography>
            {isPayAll && (
              <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                Barcha to'lanmagan oylar uchun
              </Typography>
            )}
          </Box>

          <TextField
            fullWidth
            label="Dollar"
            value={dollarInput}
            onChange={(e) => handleDollarChange(e.target.value)}
            placeholder="0.00"
            inputRef={dollarInputRef}
            InputProps={{
              endAdornment: <InputAdornment position="end">$</InputAdornment>,
            }}
          />

          <TextField
            fullWidth
            label="So'm"
            value={sumInput}
            onChange={(e) => handleSumChange(e.target.value)}
            placeholder="0"
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

          {/* Real-time hisoblash natijasi - faqat oddiy to'lov uchun */}
          {!isPayAll && dollarAmount > 0 && (
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
