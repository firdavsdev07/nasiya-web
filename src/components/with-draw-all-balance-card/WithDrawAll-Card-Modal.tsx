import type { FC } from "react";
import type { IEmployee } from "src/types/employee";
import type { CurrencyDetails } from "src/types/cash";

import { useState } from "react";

import {
  Grid,
  Stack,
  Button,
  Divider,
  Checkbox,
  TextField,
  Typography,
  FormControlLabel,
} from "@mui/material";

import { useAppDispatch } from "src/hooks/useAppDispatch";

import { formatNumber } from "src/utils/format-number";

import { enqueueSnackbar } from "src/store/slices/snackbar";
import { withdrawFromBalance } from "src/store/actions/employeeActions";

type CurrencyKey = "sum" | "dollar";

const balanceFields: readonly {
  key: CurrencyKey;
  label: string;
  currency: "so'm" | "$";
}[] = [
  { key: "sum", label: "Naqt so'm", currency: "so'm" },
  { key: "dollar", label: "Naqt dollar", currency: "$" },
];

interface Props {
  employee: IEmployee;
}

const WithdrawAllBalanceCard: FC<Props> = ({ employee }) => {
  const dispatch = useAppDispatch();
  const [amounts, setAmounts] = useState<Partial<Record<CurrencyKey, number>>>(
    {}
  );
  const [showControls, setShowControls] = useState(false);
  const [notes, setNotes] = useState("");

  const handleChange = (key: CurrencyKey, value: number) => {
    if (value < 0) return;
    const max = employee.balance[key] ?? 0;
    if (value > max) {
      dispatch(
        enqueueSnackbar({
          message: `${balanceFields.find((f) => f.key === key)?.label} uchun ${formatNumber(max)} dan oshirib bo'lmaydi`,
          options: { variant: "warning" },
        })
      );
      value = max;
    }
    setAmounts((prev) => ({ ...prev, [key]: value }));
  };

  const handleFullWithdraw = (key: CurrencyKey) => {
    handleChange(key, employee.balance[key] || 0);
  };

  const handleSubmit = () => {
    const normalizedAmounts: CurrencyDetails = {
      sum: amounts.sum ?? 0,
      dollar: amounts.dollar ?? 0,
    };

    const total = Object.values(normalizedAmounts).reduce(
      (acc, val) => Number(acc || 0) + Number(val || 0),
      0 as number
    ) as number;

    if (total <= 0) {
      dispatch(
        enqueueSnackbar({
          message: "Yechilayotgan summa 0 bo'lishi mumkin emas",
          options: { variant: "error" },
        })
      );
      return;
    }

    // Balans yetarliligini tekshirish
    if (normalizedAmounts.dollar > (employee.balance.dollar ?? 0)) {
      dispatch(
        enqueueSnackbar({
          message: `Balansda yetarli dollar yo'q. Mavjud: ${formatNumber(employee.balance.dollar ?? 0)} $`,
          options: { variant: "error" },
        })
      );
      return;
    }

    if (normalizedAmounts.sum > (employee.balance.sum ?? 0)) {
      dispatch(
        enqueueSnackbar({
          message: `Balansda yetarli so'm yo'q. Mavjud: ${formatNumber(employee.balance.sum ?? 0)} so'm`,
          options: { variant: "error" },
        })
      );
      return;
    }

    console.log("💰 Submitting withdraw:", {
      employeeId: employee._id,
      amounts: normalizedAmounts,
      currentBalance: employee.balance,
    });

    dispatch(withdrawFromBalance(employee._id, normalizedAmounts, notes));
    setAmounts({});
    setNotes("");
    setShowControls(false); // Yechish rejimini o'chirish
  };

  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">Umumiy yechib olish</Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={showControls}
              onChange={(e) => {
                setShowControls(e.target.checked);
                if (!e.target.checked) {
                  setAmounts({});
                  setNotes("");
                }
              }}
            />
          }
          label="Yechish rejimini yoqish"
        />
      </Stack>

      <Stack spacing={2}>
        {balanceFields.map(({ key, label }) => (
          <Grid container spacing={1} key={key} alignItems="center">
            <Grid item xs={4}>
              <Typography variant="body2">
                {label}: {formatNumber(employee.balance[key] ?? 0)}
              </Typography>
            </Grid>
            <Grid item xs={5}>
              <TextField
                size="small"
                type="number"
                value={amounts[key] ?? ""}
                onChange={(e) => handleChange(key, Number(e.target.value))}
                fullWidth
                placeholder="Miqdor"
                disabled={!showControls}
              />
            </Grid>
            <Grid item xs={3}>
              {showControls && (
                <Button
                  variant="outlined"
                  fullWidth
                  size="small"
                  onClick={() => handleFullWithdraw(key)}
                >
                  To'liq
                </Button>
              )}
            </Grid>
          </Grid>
        ))}
      </Stack>

      {showControls && (
        <>
          <Divider sx={{ my: 2 }} />
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Izoh (ixtiyoriy)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Nima uchun pul yechib olinmoqda?"
            sx={{ mb: 2 }}
          />
          <Button variant="contained" fullWidth onClick={handleSubmit}>
            Yechib olish
          </Button>
        </>
      )}
    </>
  );
};

export default WithdrawAllBalanceCard;
