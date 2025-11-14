import type { FC } from "react";

import React, { useState } from "react";

import {
  Box,
  Chip,
  Paper,
  Table,
  Button,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableContainer,
} from "@mui/material";
import { format, addMonths } from "date-fns";
import { uz } from "date-fns/locale";

import { Iconify } from "../iconify";
import { PaymentModal } from "../payment-modal";

interface PaymentScheduleItem {
  month: number;
  date: string;
  amount: number;
  isPaid: boolean;
  isInitial?: boolean;
}

interface PaymentScheduleProps {
  startDate: string;
  monthlyPayment: number;
  period: number;
  initialPayment?: number;
  initialPaymentDueDate?: string;
  contractId?: string;
  remainingDebt?: number;
  totalPaid?: number;
  payments?: Array<{
    _id?: string; // ✅ Payment ID
    date: Date;
    amount: number;
    actualAmount?: number; // ✅ Haqiqatda to'langan summa
    isPaid: boolean;
    paymentType?: string;
    status?: string;
    remainingAmount?: number;
    excessAmount?: number;
    expectedAmount?: number;
  }>;
  onPaymentSuccess?: () => void;
}

const PaymentSchedule: FC<PaymentScheduleProps> = ({
  startDate,
  monthlyPayment,
  period,
  initialPayment = 0,
  initialPaymentDueDate,
  contractId,
  remainingDebt = 0,
  totalPaid = 0,
  payments = [],
  onPaymentSuccess,
}) => {
  const [paymentModal, setPaymentModal] = useState<{
    open: boolean;
    amount: number;
    isPayAll?: boolean;
    paymentId?: string; // ✅ Qolgan qarzni to'lash uchun
  }>({
    open: false,
    amount: 0,
    isPayAll: false,
    paymentId: undefined,
  });
  // Debug: payments prop o'zgarganda log qilish
  React.useEffect(() => {
    console.log("📋 PaymentSchedule - payments prop updated:", {
      paymentsCount: payments.length,
      payments: payments.map(p => ({
        amount: p.amount,
        actualAmount: p.actualAmount,
        isPaid: p.isPaid,
        status: p.status,
        remainingAmount: p.remainingAmount,
      })),
    });
  }, [payments]);

  // To'lov jadvalini yaratish
  const generateSchedule = (): PaymentScheduleItem[] => {
    const schedule: PaymentScheduleItem[] = [];
    const start = new Date(startDate);

    // Boshlang'ich to'lov qilinganmi tekshirish - payments arraydan
    const initialPaymentRecord = payments.find(
      (p) => p.paymentType === "initial" && p.isPaid
    );
    const isInitialPaid = !!initialPaymentRecord;

    // Boshlang'ich to'lovni qo'shish
    if (initialPayment > 0) {
      const initialDate = initialPaymentDueDate
        ? new Date(initialPaymentDueDate)
        : start;

      schedule.push({
        month: 0,
        date: format(initialDate, "yyyy-MM-dd"),
        amount: initialPayment,
        isPaid: isInitialPaid,
        isInitial: true,
      });
    }

    // Oylik to'lovlarni sanasi bo'yicha tartiblash
    const monthlyPayments = payments
      .filter(p => p.paymentType !== 'initial' && p.isPaid)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Oylik to'lovlarni qo'shish
    for (let i = 1; i <= period; i++) {
      const paymentDate = addMonths(start, i);
      
      // Bu oy uchun to'lov mavjudmi tekshirish (index bo'yicha)
      const isPaid = i <= monthlyPayments.length;

      schedule.push({
        month: i,
        date: format(paymentDate, "yyyy-MM-dd"),
        amount: monthlyPayment,
        isPaid,
      });
    }

    return schedule;
  };

  const schedule = generateSchedule();
  const today = new Date();

  const handlePayment = (amount: number, paymentId?: string) => {
    console.log("💰 Opening payment modal:", { amount, paymentId });
    setPaymentModal({ open: true, amount, paymentId });
  };

  const handlePayAll = () => {
    setPaymentModal({ open: true, amount: remainingDebt, isPayAll: true });
  };

  const handlePaymentSuccess = () => {
    console.log("💰 Payment completed - closing modal and refreshing data");
    setPaymentModal({ open: false, amount: 0, isPayAll: false, paymentId: undefined });
    if (onPaymentSuccess) {
      console.log("🔄 Calling onPaymentSuccess callback");
      onPaymentSuccess();
    } else {
      console.warn("⚠️ onPaymentSuccess callback not provided");
    }
  };

  return (
    <>
      <Paper elevation={0} sx={{ p: { xs: 1, sm: 1.5 }, border: 1, borderColor: "divider" }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1.5}
          flexWrap="wrap"
          gap={1}
        >
          <Box>
            <Typography variant="subtitle1" fontWeight="600">
              To'lov jadvali
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {period} oylik • {schedule.filter((s) => s.isPaid).length}/{schedule.length} to'langan
            </Typography>
          </Box>
          {remainingDebt > 0 && contractId && (
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={handlePayAll}
            >
              Barchasini to'lash ({remainingDebt.toLocaleString()} $)
            </Button>
          )}
        </Box>

        <TableContainer sx={{ maxHeight: "60vh", overflowX: "auto" }}>
          <Table size="small" stickyHeader sx={{ minWidth: "100%", width: "100%" }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  bgcolor: "grey.50", 
                  py: 1, 
                  px: { xs: 0.5, sm: 1, md: 2 },
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  borderBottom: "1px solid rgba(224, 224, 224, 1)",
                  whiteSpace: "nowrap"
                }}>
                  #
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  bgcolor: "grey.50", 
                  py: 1, 
                  px: { xs: 0.5, sm: 1, md: 2 },
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  borderBottom: "1px solid rgba(224, 224, 224, 1)",
                  whiteSpace: "nowrap"
                }}>
                  Belgilangan sana
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  bgcolor: "grey.50", 
                  py: 1, 
                  px: { xs: 0.5, sm: 1, md: 2 },
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  borderBottom: "1px solid rgba(224, 224, 224, 1)",
                  whiteSpace: "nowrap"
                }}>
                  To'langan sana
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ 
                    fontWeight: 600, 
                    bgcolor: "grey.50", 
                    py: 1, 
                    px: { xs: 0.5, sm: 1, md: 2 },
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    borderBottom: "1px solid rgba(224, 224, 224, 1)",
                    whiteSpace: "nowrap"
                  }}
                >
                  Summa
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ 
                    fontWeight: 600, 
                    bgcolor: "grey.50", 
                    py: 1, 
                    px: { xs: 0.5, sm: 1, md: 2 },
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    borderBottom: "1px solid rgba(224, 224, 224, 1)",
                    whiteSpace: "nowrap"
                  }}
                >
                  To&apos;langan
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ 
                    fontWeight: 600, 
                    bgcolor: "grey.50", 
                    py: 1, 
                    px: { xs: 0.5, sm: 1, md: 2 },
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    borderBottom: "1px solid rgba(224, 224, 224, 1)",
                    whiteSpace: "nowrap"
                  }}
                >
                  Holat
                </TableCell>
                {contractId && (
                  <TableCell
                    align="center"
                    sx={{ 
                      fontWeight: 600, 
                      bgcolor: "grey.50", 
                      py: 1, 
                      px: { xs: 0.5, sm: 1, md: 2 },
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      borderBottom: "1px solid rgba(224, 224, 224, 1)",
                      whiteSpace: "nowrap"
                    }}
                  >
                    Amal
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {(() => {
                let previousExcess = 0; // Oldingi oydan kelgan ortiqcha summa
                
                // To'lovlarni sanasi bo'yicha tartiblash
                const sortedPayments = [...payments].sort((a, b) => 
                  new Date(a.date).getTime() - new Date(b.date).getTime()
                );
                
                // Oylik to'lovlarni ajratish (initial to'lovni chiqarib tashlash)
                const monthlyPayments = sortedPayments.filter(p => 
                  p.paymentType !== 'initial' && p.isPaid
                );

                return schedule.map((item, index) => {
                  const isPast = new Date(item.date) < today;

                  // Haqiqiy to'lov ma'lumotlarini topish
                  let actualPayment;
                  
                  if (item.isInitial) {
                    // Boshlang'ich to'lov uchun
                    actualPayment = payments.find((p) => 
                      p.paymentType === 'initial' && p.isPaid
                    );
                  } else {
                    // Oylik to'lovlar uchun - index bo'yicha topish (0-indexed)
                    // item.month 1 dan boshlanadi, shuning uchun -1 qilamiz
                    actualPayment = monthlyPayments[item.month - 1];
                  }

                  // Ortiqcha va kam to'langan summalarni tekshirish
                  const hasExcess =
                    actualPayment?.excessAmount != null &&
                    actualPayment.excessAmount > 0.01;
                  
                  // ✅ KAM TO'LANGAN SUMMANI TEKSHIRISH (FIXED - ESKI TO'LOVLAR UCHUN HAM)
                  let remainingAmountToShow = 0;
                  let hasShortage = false;
                  
                  if (actualPayment && item.isPaid) {
                    // PRIORITY 1: remainingAmount (backend'dan to'g'ridan-to'g'ri)
                    if (actualPayment.remainingAmount != null && actualPayment.remainingAmount > 0.01) {
                      remainingAmountToShow = actualPayment.remainingAmount;
                      hasShortage = true;
                    }
                    // PRIORITY 2: actualAmount mavjud va expectedAmount'dan kam
                    else if (actualPayment.actualAmount != null && actualPayment.actualAmount !== undefined) {
                      const expected = actualPayment.expectedAmount || actualPayment.amount || item.amount;
                      const actual = actualPayment.actualAmount;
                      const diff = expected - actual;
                      
                      if (diff > 0.01) {
                        remainingAmountToShow = diff;
                        hasShortage = true;
                      }
                    }
                    // PRIORITY 3: Status UNDERPAID
                    else if (actualPayment.status === 'UNDERPAID') {
                      const expected = actualPayment.expectedAmount || actualPayment.amount || item.amount;
                      const actual = actualPayment.amount;
                      const diff = expected - actual;
                      
                      if (diff > 0.01) {
                        remainingAmountToShow = diff;
                        hasShortage = true;
                      }
                    }
                    // PRIORITY 4: ESKI TO'LOVLAR UCHUN - amount'ni tekshirish
                    // Agar actualAmount undefined bo'lsa, bu eski to'lov
                    // Eski to'lovlarda amount = actualAmount deb hisoblaymiz
                    // Agar amount < item.amount bo'lsa, kam to'langan
                    else if (actualPayment.actualAmount === undefined || actualPayment.actualAmount === null) {
                      const expected = item.amount; // Oylik to'lov
                      const actual = actualPayment.amount; // Haqiqatda to'langan (eski to'lovlarda)
                      const diff = expected - actual;
                      
                      if (diff > 0.01) {
                        remainingAmountToShow = diff;
                        hasShortage = true;
                        console.log(`⚠️ OLD PAYMENT - SHORTAGE DETECTED for month ${item.month}:`, {
                          expected,
                          actual,
                          diff,
                        });
                      }
                    }
                    
                    // DEBUG - Har bir to'lov uchun ma'lumotlarni ko'rsatish
                    console.log(`🔍 Payment ${item.month} check:`, {
                      isPaid: item.isPaid,
                      hasActualPayment: !!actualPayment,
                      remainingAmount: actualPayment?.remainingAmount,
                      actualAmount: actualPayment?.actualAmount,
                      expectedAmount: actualPayment?.expectedAmount,
                      amount: actualPayment?.amount,
                      status: actualPayment?.status,
                      hasShortage,
                      remainingAmountToShow,
                    });
                    
                    if (hasShortage) {
                      console.log(`⚠️ SHORTAGE DETECTED for month ${item.month}:`, {
                        remainingAmountToShow,
                        willShowButton: true,
                      });
                    }
                  }

                  // ✅ HAQIQIY TO'LANGAN SUMMA
                  let actualPaidAmount = 0;
                  if (item.isPaid && actualPayment) {
                    // 1. actualAmount mavjud bo'lsa (yangi to'lovlar)
                    if (actualPayment.actualAmount !== undefined && actualPayment.actualAmount !== null) {
                      actualPaidAmount = actualPayment.actualAmount;
                      console.log(`💰 Payment ${item.month} - Using actualAmount: ${actualPaidAmount}`);
                    } 
                    // 2. actualAmount yo'q bo'lsa, amount'dan foydalanamiz (eski to'lovlar)
                    else {
                      actualPaidAmount = actualPayment.amount;
                      console.log(`💰 Payment ${item.month} - Using amount (old): ${actualPaidAmount}`);
                    }
                  }
                  
                  const expectedAmount = actualPayment?.expectedAmount || item.amount;

                  // Kechikish kunlarini hisoblash
                  let delayDays = 0;
                  if (actualPayment && item.isPaid) {
                    const scheduledDate = new Date(item.date);
                    const paidDate = new Date(actualPayment.date);
                    delayDays = Math.floor(
                      (paidDate.getTime() - scheduledDate.getTime()) /
                        (1000 * 60 * 60 * 24)
                    );
                  }

                  // KASKAD LOGIKA - Serverdan kelgan ma'lumotlarni ishlatish
                  const fromPreviousMonth = previousExcess; // Oldingi oydan kelgan
                  const monthlyPaymentAmount = item.amount; // Oylik to'lov

                  // Agar actualPayment mavjud bo'lsa, serverdan kelgan expectedAmount ni ishlatamiz
                  const needToPay = actualPayment?.expectedAmount
                    ? actualPayment.expectedAmount
                    : Math.max(0, monthlyPaymentAmount - fromPreviousMonth); // To'lash kerak

                  const actuallyPaid = actualPaidAmount; // To'langan

                  // Ortiqcha/Kam summani hisoblash
                  let toNextMonth = 0;
                  let shortage = 0;

                  if (item.isPaid && actualPayment) {
                    // Serverdan kelgan ma'lumotlarni ishlatish
                    if (
                      actualPayment.excessAmount &&
                      actualPayment.excessAmount > 0.01
                    ) {
                      toNextMonth = actualPayment.excessAmount;
                    } else if (
                      actualPayment.remainingAmount &&
                      actualPayment.remainingAmount > 0.01
                    ) {
                      shortage = actualPayment.remainingAmount;
                    } else {
                      // Agar server ma'lumoti bo'lmasa, o'zimiz hisoblash
                      const diff = actuallyPaid - needToPay;
                      if (diff > 0.01) {
                        toNextMonth = diff;
                      } else if (diff < -0.01) {
                        shortage = Math.abs(diff);
                      }
                    }
                  }

                  // Keyingi oy uchun previousExcess ni yangilash
                  if (item.isPaid) {
                    previousExcess = toNextMonth;
                  } else {
                    previousExcess = 0; // Agar to'lanmagan bo'lsa, kaskad to'xtaydi
                  }

                  return (
                    <React.Fragment key={`payment-${item.month}`}>
                      <TableRow
                        sx={{
                          bgcolor: item.isPaid
                            ? "success.lighter"
                            : isPast && !item.isPaid
                              ? "error.lighter"
                              : "inherit",
                          borderBottom: "1px solid rgba(224, 224, 224, 1)",
                          "&:hover": {
                            bgcolor: item.isPaid
                              ? "success.light"
                              : isPast && !item.isPaid
                                ? "error.light"
                                : "grey.100",
                          },
                          "&:last-child": {
                            borderBottom: "1px solid rgba(224, 224, 224, 1)",
                          },
                        }}
                      >
                        {/* # */}
                        <TableCell sx={{ 
                          py: 1, 
                          px: { xs: 0.5, sm: 1, md: 2 },
                          borderBottom: "1px solid rgba(224, 224, 224, 1)" 
                        }}>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            {isPast && !item.isPaid && (
                              <Iconify icon="mdi:alert-circle" width={16} sx={{ color: "error.main" }} />
                            )}
                            <Typography 
                              variant="body2" 
                              fontWeight="600" 
                              fontSize={{ xs: "0.75rem", sm: "0.875rem" }}
                              color={isPast && !item.isPaid ? "error.main" : "inherit"}
                            >
                              {item.isInitial ? "Boshlang'ich" : `${item.month}-oy`}
                              {isPast && !item.isPaid && " (Kechikkan)"}
                            </Typography>
                          </Box>
                        </TableCell>

                        {/* Belgilangan sana */}
                        <TableCell sx={{ 
                          py: 1, 
                          px: { xs: 0.5, sm: 1, md: 2 },
                          borderBottom: "1px solid rgba(224, 224, 224, 1)" 
                        }}>
                          <Typography variant="body2" fontSize={{ xs: "0.75rem", sm: "0.875rem" }}>
                            {format(new Date(item.date), "dd.MM.yyyy")}
                          </Typography>
                        </TableCell>

                        {/* To'langan sana */}
                        <TableCell sx={{ 
                          py: 1, 
                          px: { xs: 0.5, sm: 1, md: 2 },
                          borderBottom: "1px solid rgba(224, 224, 224, 1)" 
                        }}>
                          {item.isPaid ? (
                            <Typography
                              variant="body2"
                              fontSize="0.875rem"
                              color={delayDays > 0 ? "error.main" : "success.main"}
                            >
                              {item.isInitial
                                ? format(new Date(item.date), "dd.MM.yyyy")
                                : actualPayment
                                  ? format(new Date(actualPayment.date), "dd.MM.yyyy")
                                  : format(new Date(item.date), "dd.MM.yyyy")}
                              {!item.isInitial && delayDays > 0 && ` (+${delayDays})`}
                            </Typography>
                          ) : (
                            <Typography variant="body2" color="text.disabled">
                              —
                            </Typography>
                          )}
                        </TableCell>

                        {/* Summa - Oylik to'lov (har doim bir xil) */}
                        <TableCell align="right" sx={{ 
                          py: 1,
                          px: { xs: 0.5, sm: 1, md: 2 },
                          borderBottom: "1px solid rgba(224, 224, 224, 1)" 
                        }}>
                          <Typography variant="body2" fontWeight="medium" fontSize={{ xs: "0.75rem", sm: "0.875rem" }}>
                            {item.amount.toLocaleString()} $
                          </Typography>
                        </TableCell>

                        {/* To'langan */}
                        <TableCell align="right" sx={{ 
                          py: 1,
                          px: { xs: 0.5, sm: 1, md: 2 },
                          borderBottom: "1px solid rgba(224, 224, 224, 1)" 
                        }}>
                          {item.isPaid ? (
                            <Box>
                              <Typography 
                                variant="body2" 
                                fontWeight="medium"
                                color="success.main"
                              >
                                {actualPaidAmount.toLocaleString()} $
                              </Typography>
                              {hasShortage && remainingAmountToShow > 0.01 && (
                                <Box
                                  sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                    mt: 0.5,
                                    px: 1,
                                    py: 0.25,
                                    bgcolor: "error.lighter",
                                    borderRadius: 1,
                                  }}
                                >
                                  <Iconify
                                    icon="mdi:arrow-down"
                                    width={14}
                                    sx={{ color: "error.main" }}
                                  />
                                  <Typography
                                    variant="caption"
                                    fontWeight="bold"
                                    color="error.main"
                                  >
                                    {remainingAmountToShow.toLocaleString()}{" "}
                                    $ kam
                                  </Typography>
                                </Box>
                              )}
                              {hasExcess && actualPayment?.excessAmount && (
                                <Box
                                  sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                    mt: 0.5,
                                    px: 1,
                                    py: 0.25,
                                    bgcolor: "info.lighter",
                                    borderRadius: 1,
                                  }}
                                >
                                  <Iconify
                                    icon="mdi:arrow-up"
                                    width={14}
                                    sx={{ color: "info.main" }}
                                  />
                                  <Typography
                                    variant="caption"
                                    fontWeight="bold"
                                    color="info.main"
                                  >
                                    {actualPayment.excessAmount.toLocaleString()}{" "}
                                    $ ortiqcha
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          ) : (
                            <Typography variant="body2" color="text.disabled">
                              —
                            </Typography>
                          )}
                        </TableCell>

                        {/* Holat */}
                        <TableCell align="center" sx={{ 
                          py: 1, 
                          px: { xs: 0.5, sm: 1, md: 2 },
                          borderBottom: "1px solid rgba(224, 224, 224, 1)" 
                        }}>
                          <Chip
                            label={item.isPaid ? "Paid" : isPast ? "Kechikkan" : "Kutilmoqda"}
                            color={item.isPaid ? "success" : isPast ? "error" : "default"}
                            size="small"
                            sx={{ 
                              minWidth: { xs: "auto", sm: 90 },
                              fontSize: { xs: "0.65rem", sm: "0.75rem" },
                              height: { xs: 24, sm: 32 }
                            }}
                          />
                        </TableCell>

                        {/* Amal */}
                        {contractId && (
                          <TableCell align="center" sx={{ 
                            py: 1, 
                            px: { xs: 0.5, sm: 1, md: 2 },
                            borderBottom: "1px solid rgba(224, 224, 224, 1)" 
                          }}>
                            {!item.isPaid ? (
                              <Button
                                size="small"
                                variant="contained"
                                color={isPast ? "error" : "primary"}
                                onClick={() => handlePayment(item.amount)}
                                startIcon={<Iconify icon="mdi:cash" width={16} />}
                                sx={{
                                  fontSize: { xs: "0.7rem", sm: "0.8125rem" },
                                  px: { xs: 1, sm: 2 },
                                  py: { xs: 0.5, sm: 0.75 },
                                  whiteSpace: "nowrap"
                                }}
                              >
                                To'lash
                              </Button>
                            ) : hasShortage && remainingAmountToShow > 0.01 ? (
                              <Button
                                size="small"
                                variant="contained"
                                color="error"
                                onClick={() => handlePayment(remainingAmountToShow, actualPayment?._id)}
                                startIcon={<Iconify icon="mdi:alert-circle" width={16} />}
                                sx={{
                                  animation: 'pulse 2s infinite',
                                  '@keyframes pulse': {
                                    '0%, 100%': { opacity: 1 },
                                    '50%': { opacity: 0.7 },
                                  },
                                  fontSize: { xs: "0.65rem", sm: "0.75rem" },
                                  px: { xs: 0.75, sm: 1.5 },
                                  py: { xs: 0.5, sm: 0.75 },
                                  whiteSpace: "nowrap"
                                }}
                              >
                                Qarz ({remainingAmountToShow.toLocaleString()} $)
                              </Button>
                            ) : (
                              <Chip
                                label="To'langan"
                                color="success"
                                size="small"
                                icon={<Iconify icon="mdi:check-circle" width={16} />}
                                sx={{
                                  fontSize: { xs: "0.65rem", sm: "0.75rem" },
                                  height: { xs: 24, sm: 32 }
                                }}
                              />
                            )}
                          </TableCell>
                        )}
                      </TableRow>
                    </React.Fragment>
                  );
                });
              })()}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Xulosa - Ixcham */}
        <Box
          sx={{
            mt: 1.5,
            p: 1.5,
            bgcolor: "grey.50",
            borderRadius: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box display="flex" gap={3} flexWrap="wrap">
            <Box>
              <Typography variant="caption" color="text.secondary">
                Umumiy
              </Typography>
              <Typography variant="body2" fontWeight="600">
                {(monthlyPayment * period + initialPayment).toLocaleString()} $
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                To'langan
              </Typography>
              <Typography variant="body2" fontWeight="600" color="success.main">
                {totalPaid.toLocaleString()} $
              </Typography>
            </Box>
            {remainingDebt > 0 && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Qolgan
                </Typography>
                <Typography variant="body2" fontWeight="600" color="error.main">
                  {remainingDebt.toLocaleString()} $
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>

      {/* To'lov modal */}
      {contractId && (
        <PaymentModal
          open={paymentModal.open}
          amount={paymentModal.amount}
          contractId={contractId}
          isPayAll={paymentModal.isPayAll}
          paymentId={paymentModal.paymentId} // ✅ Qolgan qarzni to'lash uchun
          onClose={() => setPaymentModal({ open: false, amount: 0, isPayAll: false, paymentId: undefined })}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
};

export default PaymentSchedule;
