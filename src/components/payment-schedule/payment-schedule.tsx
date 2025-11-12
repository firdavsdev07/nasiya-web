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
    date: Date;
    amount: number;
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
  }>({
    open: false,
    amount: 0,
  });
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

    // Oylik to'lovlarni qo'shish
    // To'langan oylarni hisoblash (totalPaid asosida)
    let remainingPaid = totalPaid - (isInitialPaid ? initialPayment : 0);

    for (let i = 1; i <= period; i++) {
      const paymentDate = addMonths(start, i);

      // Agar qolgan to'langan summa oylik to'lovdan katta yoki teng bo'lsa, bu oy to'langan
      // 0.01 qo'shamiz - kichik hisob-kitob xatoliklarini hisobga olish uchun
      const isPaid = remainingPaid >= monthlyPayment - 0.01;

      if (isPaid) {
        // Har bir to'langan oydan oylik to'lovni ayiramiz
        remainingPaid -= monthlyPayment;
      }

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

  const handlePayment = (amount: number) => {
    setPaymentModal({ open: true, amount });
  };

  const handlePayAll = () => {
    setPaymentModal({ open: true, amount: remainingDebt });
  };

  const handlePaymentSuccess = () => {
    setPaymentModal({ open: false, amount: 0 });
    if (onPaymentSuccess) {
      onPaymentSuccess();
    }
  };

  return (
    <>
      <Paper elevation={0} sx={{ p: 1.5, border: 1, borderColor: "divider" }}>
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

        <TableContainer sx={{ maxHeight: 500, overflowX: "auto" }}>
          <Table size="small" stickyHeader sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, bgcolor: "grey.50", py: 1 }}>
                  #
                </TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: "grey.50", py: 1 }}>
                  Belgilangan sana
                </TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: "grey.50", py: 1 }}>
                  To'langan sana
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: 600, bgcolor: "grey.50", py: 1 }}
                >
                  Summa
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 600, bgcolor: "grey.50", py: 1 }}
                >
                  Holat
                </TableCell>
                {contractId && (
                  <TableCell
                    align="center"
                    sx={{ fontWeight: 600, bgcolor: "grey.50", py: 1 }}
                  >
                    Amal
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {(() => {
                let previousExcess = 0; // Oldingi oydan kelgan ortiqcha summa

                return schedule.map((item, index) => {
                  const isPast = new Date(item.date) < today;

                  // Haqiqiy to'lov ma'lumotlarini topish
                  const actualPayment = payments.find((p) => {
                    const paymentDate = new Date(p.date);
                    const itemDate = new Date(item.date);
                    return (
                      paymentDate.getMonth() === itemDate.getMonth() &&
                      paymentDate.getFullYear() === itemDate.getFullYear() &&
                      p.isPaid
                    );
                  });

                  const hasExcess =
                    actualPayment?.excessAmount != null &&
                    actualPayment.excessAmount > 0.01;
                  const hasShortage =
                    actualPayment?.remainingAmount != null &&
                    actualPayment.remainingAmount > 0.01;

                  // Haqiqiy to'langan summa
                  const actualPaidAmount = actualPayment?.amount || 0;
                  const expectedAmount =
                    actualPayment?.expectedAmount || item.amount;

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
                          "&:hover": {
                            bgcolor: item.isPaid
                              ? "success.light"
                              : isPast && !item.isPaid
                                ? "error.light"
                                : "grey.100",
                          },
                        }}
                      >
                        {/* # */}
                        <TableCell sx={{ py: 1 }}>
                          <Typography variant="body2" fontWeight="600">
                            {item.isInitial ? "Boshlang'ich" : `${item.month}-oy`}
                          </Typography>
                        </TableCell>

                        {/* Belgilangan sana */}
                        <TableCell sx={{ py: 1 }}>
                          <Typography variant="body2" fontSize="0.875rem">
                            {format(new Date(item.date), "dd.MM.yyyy")}
                          </Typography>
                        </TableCell>

                        {/* To'langan sana */}
                        <TableCell sx={{ py: 1 }}>
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

                        {/* Summa */}
                        <TableCell align="right">
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {expectedAmount.toLocaleString()} $
                            </Typography>
                            {item.isPaid &&
                              hasShortage &&
                              actualPayment?.remainingAmount && (
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
                                    {actualPayment.remainingAmount.toLocaleString()}{" "}
                                    $ kam
                                  </Typography>
                                </Box>
                              )}
                            {item.isPaid &&
                              hasExcess &&
                              actualPayment?.excessAmount && (
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
                        </TableCell>

                        {/* Holat */}
                        <TableCell align="center" sx={{ py: 1 }}>
                          <Chip
                            label={item.isPaid ? "Paid" : isPast ? "Kechikkan" : "Kutilmoqda"}
                            color={item.isPaid ? "success" : isPast ? "error" : "default"}
                            size="small"
                            sx={{ minWidth: 90, fontSize: "0.75rem" }}
                          />
                        </TableCell>

                        {/* Amal */}
                        {contractId && (
                          <TableCell align="center" sx={{ py: 1 }}>
                            {!item.isPaid && (
                              <Button
                                size="small"
                                variant="contained"
                                color={isPast ? "error" : "primary"}
                                onClick={() => handlePayment(item.amount)}
                              >
                                To'lash
                              </Button>
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
          onClose={() => setPaymentModal({ open: false, amount: 0 })}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
};

export default PaymentSchedule;
