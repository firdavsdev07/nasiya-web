import type { RootState } from "src/store";

import { useSelector } from "react-redux";
import { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import {
  Card,
  Stack,
  Alert,
  // Table,
  // Paper,
  Button,
  // TableRow,
  // TableHead,
  // TableCell,
  // TableBody,
  TextField,
  Typography,
  Autocomplete,
  // TableContainer,
  CircularProgress,
} from "@mui/material";

import { useAppDispatch } from "src/hooks/useAppDispatch";

import { setModal } from "src/store/slices/modalSlice";
import { setContractId } from "src/store/slices/contractSlice";
import { DashboardContent } from "src/layouts/dashboard";
import { getManagers } from "src/store/actions/employeeActions";
import {
  getPendingPayments,
  confirmPayments,
} from "src/store/actions/cashActions";

import Loader from "src/components/loader/Loader";

import ChashTable from "./cashTable";
import { columnsCash } from "./column";
import ActionCash from "../action/action-cash";

export function CashView() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const dataEmployee = useSelector((state: RootState) => state.employee);
  const { profile } = useSelector((state: RootState) => state.auth);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const { isLoading, payments, error } = useSelector(
    (state: RootState) => state.cash
  );
  const [manager, setManager] = useState<{
    firstName: string;
    lastName: string;
  } | null>(null);
  const hasFetchedManager = useRef(false);

  // Seller'dan boshqa barcha role'lar tasdiqlashi mumkin
  const canConfirmPayments = profile.role !== "seller" && profile.role !== null;

  useEffect(() => {
    dispatch(getPendingPayments());
  }, [dispatch]);

  const handleCustomerFocus = useCallback(() => {
    dispatch(getManagers());
    hasFetchedManager.current = true;
  }, [dispatch]);

  const managerFullName = manager
    ? `${manager.firstName} ${manager.lastName}`
    : null;

  const filteredCash = managerFullName
    ? payments.filter((payment: any) => {
        // Mijozga biriktirilgan menејerni tekshirish (asosiy)
        if (payment.customerId && payment.customerId.manager && typeof payment.customerId.manager === "object") {
          const customerManagerName =
            `${payment.customerId.manager.firstName || ""} ${payment.customerId.manager.lastName || ""}`.trim();
          return customerManagerName === managerFullName;
        }
        // Agar mijozda menejer bo'lmasa, to'lovni qabul qilgan menејerni tekshirish
        if (payment.managerId && typeof payment.managerId === "object") {
          const paymentManagerName =
            `${payment.managerId.firstName || ""} ${payment.managerId.lastName || ""}`.trim();
          return paymentManagerName === managerFullName;
        }
        return false;
      })
    : payments;

  const ManagerFilter = (
    <Autocomplete
      onFocus={handleCustomerFocus}
      options={dataEmployee.managers}
      getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
      isOptionEqualToValue={(option, value) =>
        `${option.firstName} ${option.lastName}` ===
        `${value.firstName} ${value.lastName}`
      }
      loading={dataEmployee.isLoading}
      loadingText="Yuklanmoqda..."
      noOptionsText="Menejerlar topilmadi"
      renderInput={(params) => (
        <TextField
          {...params}
          size="small"
          label="Menejer bo'yicha filter"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {dataEmployee.isLoading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      onChange={(_event, value) => {
        setManager(value);
      }}
      value={manager}
      sx={{ minWidth: { xs: 150, sm: 180, md: 200 }, width: "100%", maxWidth: 400 }}
    />
  );

  if (payments.length === 0 && isLoading) {
    return <Loader />;
  }

  return (
    <DashboardContent>
      <Stack spacing={1}>
        <Typography variant="h4" flexGrow={1}>
          Kassa
        </Typography>

        {/* Error message */}
        {error && (
          <Alert
            severity="error"
            onClose={() => dispatch({ type: "cash/setError", payload: null })}
          >
            {error}
          </Alert>
        )}

        {/* Loading indicator */}
        {isLoading && payments.length > 0 && (
          <Alert severity="info" icon={<CircularProgress size={20} />}>
            Yuklanmoqda...
          </Alert>
        )}

        {/* Tanlangan qatorlar uchun toolbar */}
        {selectedRows.length > 0 && canConfirmPayments && (
          <Card sx={{ p: 1, mb: 1 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography>{selectedRows.length} ta tanlandi</Typography>
              <Button
                variant="contained"
                color="success"
                onClick={() => {
                  dispatch(confirmPayments(selectedRows));
                  setSelectedRows([]);
                }}
              >
                To&lsquo;lovlarni tasdiqlash
              </Button>
            </Stack>
          </Card>
        )}

        {/* Seller uchun ogohlantirish */}
        {selectedRows.length > 0 && !canConfirmPayments && (
          <Alert severity="warning" sx={{ mb: 1 }}>
            Seller to&lsquo;lovlarni tasdiqlashi mumkin emas
          </Alert>
        )}

        <ChashTable
          data={filteredCash}
          columns={columnsCash}
          component={ManagerFilter}
          onRowClick={(row: any) => {
            // ✅ Modal oynada shartnoma ma'lumotlarini ko'rsatish
            console.log("🖱️ Row clicked:", row);
            dispatch(
              setModal({
                modal: "cashInfoModal",
                data: { type: "info", data: row }, // ModalData structure
              })
            );
          }}
          selectable={canConfirmPayments} // ✅ Faqat kassa xodimlari uchun checkbox
          setSelectedRows={setSelectedRows}
          renderActions={(cash) => <ActionCash cash={cash} />}
        />

        {/* <TableContainer component={Paper} sx={{ maxWidth: 400 }}>
          <Typography variant="h6" sx={{ p: 2, textAlign: "center" }}>
            Yakuniy Hisobot
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>To`lov turi</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">
                  Undirilgan summa (UZS)
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.payments.map((payment) => (
                <TableRow key={payment.paymentType}>
                  <TableCell>{payment.paymentType}</TableCell>
                  <TableCell align="right">{payment.formattedAmount}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Jami</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  {data.total.formattedAmount}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer> */}
      </Stack>
    </DashboardContent>
  );
}

// const data = {
//   payments: [
//     { paymentType: "Naqd", amount: 1500000, formattedAmount: "1,500,000 UZS" },
//     { paymentType: "Karta", amount: 1800000, formattedAmount: "1,800,000 UZS" },
//     { paymentType: "Visa", amount: 500000, formattedAmount: "500,000 UZS" },
//   ],
//   total: {
//     amount: 3800000,
//     formattedAmount: "3,800,000 UZS",
//     isBold: true,
//   },
// };
