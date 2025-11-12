import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Box,
  CircularProgress,
  Stack,
  Link,
  Tooltip,
} from "@mui/material";
import { format } from "date-fns";
import { getPaymentHistory } from "src/store/actions/paymentActions";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { Iconify } from "src/components/iconify";

interface PaymentHistoryProps {
  customerId?: string;
  contractId?: string;
  title?: string;
}

interface PaymentItem {
  _id: string;
  amount: number;
  date: string;
  customerName: string;
  managerName: string;
  notes: string;
  source?: string;
  status?: "PAID" | "PENDING" | "REJECTED" | "UNDERPAID" | "OVERPAID";
  paymentType?: "initial" | "monthly" | "extra";
  remainingAmount?: number;
  excessAmount?: number;
  expectedAmount?: number;
  linkedPaymentId?: string;
  prepaidAmount?: number;
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({
  customerId,
  contractId,
  title = "To'lovlar Tarixi",
}) => {
  const dispatch = useAppDispatch();
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const result = (await dispatch(
          getPaymentHistory(customerId, contractId)
        )) as any;
        if (result?.status === "success") {
          setPayments(result.data || []);
        }
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [dispatch, customerId, contractId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("uz-UZ", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd.MM.yyyy HH:mm");
  };

  const getStatusColor = (
    status?: string
  ): "success" | "warning" | "error" | "info" | "default" => {
    switch (status) {
      case "PAID":
        return "success";
      case "UNDERPAID":
        return "error";
      case "OVERPAID":
        return "success";
      case "PENDING":
        return "warning";
      case "REJECTED":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status?: string): string => {
    switch (status) {
      case "PAID":
        return "To'langan";
      case "UNDERPAID":
        return "Kam to'langan";
      case "OVERPAID":
        return "Ko'p to'langan";
      case "PENDING":
        return "Kutilmoqda";
      case "REJECTED":
        return "Rad etilgan";
      default:
        return "Noma'lum";
    }
  };

  const getPaymentTypeLabel = (type?: string): string => {
    switch (type) {
      case "initial":
        return "Boshlang'ich";
      case "monthly":
        return "Oylik";
      case "extra":
        return "Qo'shimcha";
      default:
        return "-";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight={200}
          >
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title={title}
        subheader={`Jami ${payments.length} ta to'lov`}
      />
      <CardContent>
        {payments.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            py={4}
          >
            To'lovlar tarixi mavjud emas
          </Typography>
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Sana</TableCell>
                  <TableCell>Turi</TableCell>
                  <TableCell>Summa</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Tafsilotlar</TableCell>
                  <TableCell>Izoh</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment._id} hover>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(payment.date)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getPaymentTypeLabel(payment.paymentType)}
                        size="small"
                        variant="outlined"
                        color={
                          payment.paymentType === "extra" ? "warning" : "info"
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          color="success.main"
                        >
                          {formatCurrency(payment.amount)}
                        </Typography>
                        {payment.expectedAmount &&
                          payment.expectedAmount !== payment.amount && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Kutilgan: {formatCurrency(payment.expectedAmount)}
                            </Typography>
                          )}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(payment.status)}
                        size="small"
                        color={getStatusColor(payment.status)}
                        icon={
                          payment.status === "PAID" ? (
                            <Iconify icon="mdi:check-circle" />
                          ) : payment.status === "UNDERPAID" ? (
                            <Iconify icon="mdi:alert-circle" />
                          ) : payment.status === "OVERPAID" ? (
                            <Iconify icon="mdi:check-circle" />
                          ) : undefined
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        {payment.status === "UNDERPAID" &&
                          payment.remainingAmount && (
                            <Tooltip title="Yetishmayapti">
                              <Chip
                                label={`-${formatCurrency(payment.remainingAmount)}`}
                                size="small"
                                color="error"
                                variant="outlined"
                                icon={<Iconify icon="mdi:minus-circle" />}
                              />
                            </Tooltip>
                          )}
                        {payment.status === "OVERPAID" &&
                          payment.excessAmount && (
                            <Tooltip title="Ortiqcha (keyingi oyga o'tkazildi)">
                              <Chip
                                label={`+${formatCurrency(payment.excessAmount)}`}
                                size="small"
                                color="success"
                                variant="outlined"
                                icon={<Iconify icon="mdi:plus-circle" />}
                              />
                            </Tooltip>
                          )}
                        {payment.prepaidAmount && payment.prepaidAmount > 0 && (
                          <Tooltip title="Oldindan to'langan">
                            <Chip
                              label={`Oldindan: ${formatCurrency(payment.prepaidAmount)}`}
                              size="small"
                              color="info"
                              variant="outlined"
                              icon={<Iconify icon="mdi:arrow-down-circle" />}
                            />
                          </Tooltip>
                        )}
                        {payment.linkedPaymentId && (
                          <Link
                            href={`#payment-${payment.linkedPaymentId}`}
                            variant="caption"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <Iconify icon="mdi:link" width={14} />
                            Bog'langan to'lov
                          </Link>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          maxWidth: 200,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {payment.notes || "-"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentHistory;
