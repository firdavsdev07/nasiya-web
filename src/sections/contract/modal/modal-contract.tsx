/* eslint-disable react-hooks/exhaustive-deps */
import type { RootState } from "src/store";
import type { ICustomer } from "src/types/customer";
import type { IAddContract, IEditContract } from "src/types/contract";

import { useSelector } from "react-redux";
import { FaChevronDown } from "react-icons/fa";
import { useMemo, useState, useEffect, useCallback } from "react";
import { MdCancel, MdDelete, MdCheckCircle } from "react-icons/md";

import Grid from "@mui/material/Unstable_Grid2";
import {
  Box,
  List,
  Chip,
  Stack,
  Avatar,
  Button,
  Dialog,
  Divider,
  Tooltip,
  useTheme,
  ListItem,
  Checkbox,
  TextField,
  Accordion,
  Typography,
  IconButton,
  DialogTitle,
  ListItemText,
  Autocomplete,
  DialogActions,
  DialogContent,
  useMediaQuery,
  CircularProgress,
  AccordionDetails,
  AccordionSummary,
  FormControlLabel,
  createFilterOptions,
} from "@mui/material";

import { useAppDispatch } from "src/hooks/useAppDispatch";

import { formatNumber } from "src/utils/format-number";

import { grey } from "src/theme/core";
import { setCustomer } from "src/store/slices/customerSlice";
import { setModal, closeModal } from "src/store/slices/modalSlice";
import { getSelectCustomers } from "src/store/actions/customerActions";
import { addContract, updateContract } from "src/store/actions/contractActions";

import { Iconify } from "src/components/iconify";

interface IPayment {
  date: string;
  amount: number;
  note: string;
}

interface IForm {
  customer?: string;
  productName: string;
  originalPrice: number;
  price: number;
  initialPayment: number;
  percentage: number;
  period: number;
  initialPaymentDueDate: string;
  monthlyPayment: number;
  notes: string;
  box: boolean;
  mbox: boolean;
  receipt: boolean;
  iCloud: boolean;
  totalPrice: number;
  remainingAmount: number;
  profitPrice: number;
  startDate: string;
  paymentDeadline?: string;
  payments?: IPayment[];
}

const ModalContract = () => {
  const dispatch = useAppDispatch();
  const [isTouched, setIsTouched] = useState(true);
  const { contractModal } = useSelector((state: RootState) => state.modal);
  const { selectCustomers, selectCustomer, isLoading, customer } = useSelector(
    (state: RootState) => state.customer
  );
  const contract = contractModal || {};
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const now = useMemo(() => new Date(), []);

  const defaultEndDate = useMemo(() => {
    const date = new Date(now);
    date.setMonth(now.getMonth() + 12);
    return date;
  }, [now]);
  const defaultInitialDate = useMemo(() => {
    const date = new Date(now);
    date.setMonth(now.getMonth() + 1);
    return date;
  }, [now]);

  const defaultFormValues: IForm = {
    productName: "",
    originalPrice: 0,
    price: 0,
    initialPayment: 0,
    percentage: 30,
    period: 12,
    initialPaymentDueDate: defaultInitialDate.toISOString().split("T")[0],
    monthlyPayment: 0,
    notes: "",
    box: false,
    mbox: false,
    receipt: false,
    iCloud: false,
    totalPrice: 0,
    remainingAmount: 0,
    profitPrice: 0,
    startDate: now.toISOString().split("T")[0],
    paymentDeadline: defaultEndDate.toISOString().split("T")[0],
    payments: [],
  };

  const [formValues, setFormValues] = useState<IForm>(defaultFormValues);

  const filterOptions = createFilterOptions<ICustomer>({
    limit: 3,
    stringify: (option: ICustomer) =>
      `${option.firstName} ${option.lastName} ${option.phoneNumber}`,
  });

  const { totalPrice, remainingAmount, profitPrice } = useMemo(() => {
    // Umumiy narx = Oldindan to'lov + (Oylik to'lov × Muddat)
    const total =
      formValues.initialPayment + formValues.monthlyPayment * formValues.period;

    // Qolgan summa = Oylik to'lov × Muddat
    const remaining = formValues.monthlyPayment * formValues.period;

    // Foyda = Umumiy narx - Asl narx
    const profit = total - formValues.originalPrice;

    return {
      totalPrice: total,
      remainingAmount: remaining,
      profitPrice: profit,
    };
  }, [
    formValues.initialPayment,
    formValues.monthlyPayment,
    formValues.period,
    formValues.originalPrice,
  ]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const handleNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const numValue = value === "" ? 0 : Number(value.replace(/\D/g, ""));

      setFormValues((prev) => ({ ...prev, [name]: numValue }));
    },
    []
  );

  const handleClose = useCallback(() => {
    setFormValues(defaultFormValues);
    dispatch(closeModal("contractModal"));
    dispatch(setCustomer(null));
  }, [dispatch, defaultFormValues]);

  const handleMonthlyCalculate = useCallback(() => {
    // Formula: Oylik to'lov = (Sotuv narxi + Foiz - Oldindan to'lov) / Muddat
    // Qolgan summa = Sotuv narxi - Oldindan to'lov
    const remainingAfterInitial = formValues.price - formValues.initialPayment;

    // Foizli summa = Qolgan summa + (Qolgan summa × Foiz / 100)
    const amountWithInterest =
      remainingAfterInitial +
      remainingAfterInitial * (formValues.percentage / 100);

    // Oylik to'lov = Foizli summa / Muddat
    const monthly = amountWithInterest / formValues.period;

    setFormValues((prev) => ({
      ...prev,
      monthlyPayment: Number(monthly.toFixed(2)),
    }));
  }, [
    formValues.price,
    formValues.percentage,
    formValues.initialPayment,
    formValues.period,
  ]);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const formJson = {
        ...formValues,
        id: contract.data?._id,
      };

      if (contractModal?.type === "edit") {
        dispatch(updateContract(formJson as unknown as IEditContract));
      } else {
        dispatch(addContract(formJson as unknown as IAddContract));
      }

      handleClose();
    },
    [formValues, contract, contractModal?.type, dispatch, handleClose]
  );

  const handleCustomerFocus = useCallback(() => {
    dispatch(getSelectCustomers());
  }, [selectCustomers.length, dispatch]);

  const isFormValid = useMemo(
    () =>
      formValues.productName.trim() !== "" &&
      formValues.originalPrice > 0 &&
      formValues.price > 0 &&
      formValues.initialPayment >= 0 &&
      formValues.percentage >= 0 &&
      formValues.period > 0 &&
      formValues.monthlyPayment > 0 &&
      formValues.initialPaymentDueDate !== "" &&
      formValues.notes.trim() !== "" &&
      formValues.price >= formValues.originalPrice &&
      (contractModal?.type === "edit" || !isTouched),
    [formValues, isTouched, contractModal?.type]
  );

  useEffect(() => {
    if (contractModal?.type === "edit" && contract) {
      dispatch(setCustomer(contract.data?.customer || null));

      setFormValues({
        customer: contract.data?.customer?._id,
        productName: contract.data?.productName || "",
        originalPrice: contract.data?.originalPrice || 0,
        price: contract.data?.price || 0,
        initialPayment: contract.data?.initialPayment || 0,
        percentage:
          contract.data?.percentage || contract.data?.customer?.percent || 30,
        period: contract.data?.period || 12,
        initialPaymentDueDate:
          contract.data?.initialPaymentDueDate.split("T")[0] || "",
        monthlyPayment: contract.data?.monthlyPayment || 0,
        notes: contract.data?.notes || "",
        box: contract.data?.info?.box || false,
        mbox: contract.data?.info?.mbox || false,
        receipt: contract.data?.info?.receipt || false,
        iCloud: contract.data?.info?.iCloud || false,
        totalPrice: contract.data?.totalPrice || 0,
        remainingAmount: 0,
        profitPrice: 0,
        startDate: contract.data?.startDate.toString().split("T")[0] || "",
      });
    } else {
      setFormValues(defaultFormValues);
    }
  }, [contract, contractModal?.type]);

  useEffect(() => {
    if (!formValues.initialPaymentDueDate) return;
    const baseDate = new Date(formValues.initialPaymentDueDate);
    baseDate.setMonth(baseDate.getMonth() + formValues.period - 1);
    setFormValues((prev) => ({
      ...prev,
      paymentDeadline: baseDate.toISOString().split("T")[0],
    }));
  }, [formValues.period, formValues.initialPaymentDueDate]);

  useEffect(() => {
    if (selectCustomer === null) return;
    dispatch(setCustomer(selectCustomer));
    setFormValues((prev) => ({
      ...prev,
      customer: selectCustomer?._id,
    }));
  }, [selectCustomer]);

  useEffect(() => {
    setFormValues((prev) => ({
      ...prev,
      totalPrice,
      remainingAmount,
      profitPrice,
    }));
  }, [totalPrice, remainingAmount, profitPrice]);

  useEffect(() => {
    const percentage = customer?.percent || 30;
    setFormValues((prev) => ({
      ...prev,
      percentage,
    }));
  }, [customer]);

  return (
    <Dialog
      open={!!contractModal?.type}
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
      }}
      maxWidth="xl"
      fullWidth
      fullScreen={fullScreen}
    >
      <DialogTitle>
        {contractModal?.type === "edit"
          ? "Shartnomani Tahrirlash"
          : "Yangi Mahsulot Shartnomasi"}
      </DialogTitle>
      <DialogContent sx={{ p: { xs: 1, md: 2 } }}>
        <Grid container spacing={1}>
          <Grid xs={12} my={2}>
            <Box
              display="flex"
              gap={3}
              flexDirection={{ xs: "column", sm: "row" }}
            >
              <Autocomplete
                onFocus={handleCustomerFocus}
                options={selectCustomers}
                getOptionLabel={(option) =>
                  `${option.firstName} ${option.lastName} ${option.phoneNumber}`
                }
                filterOptions={filterOptions}
                sx={{ width: { xs: "100%", sm: "100%" } }}
                loading={isLoading}
                loadingText="Yuklanmoqda..."
                noOptionsText="Mijozlar topilmadi"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Foydalanuvchini tanlang"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {isLoading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                onChange={(_event, value) => {
                  dispatch(setCustomer(value));
                  setFormValues((prev) => ({
                    ...prev,
                    customer: value?._id,
                  }));
                }}
                value={customer}
              />
              {!customer && (
                <Tooltip title="Mijoz qo'shish">
                  <Button
                    variant="contained"
                    sx={{ width: { xs: "100%", sm: 300 } }}
                    startIcon={<Iconify icon="mingcute:add-line" />}
                    onClick={() => {
                      dispatch(
                        setModal({
                          modal: "customerModal",
                          data: { type: "add", data: undefined },
                        })
                      );
                    }}
                  >
                    Qo&apos;shish
                  </Button>
                </Tooltip>
              )}
            </Box>
          </Grid>
          <Grid xs={12} lg={6}>
            {customer && (
              <>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      sx={{ width: 50, height: 50 }}
                      alt={customer?.firstName}
                    />
                    <Typography variant="h6" sx={{ cursor: "pointer" }}>
                      {`${customer?.firstName} ${customer?.lastName}`}
                    </Typography>
                    {customer?.isActive ? (
                      <Tooltip title="Tasdiqlangan mijoz" placement="top">
                        <Typography>
                          <MdCheckCircle color="green" />
                        </Typography>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Hali tasdiqlanmagan" placement="top">
                        <Typography>
                          <MdCancel color="red" />
                        </Typography>
                      </Tooltip>
                    )}
                  </Stack>
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={() => {
                      dispatch(
                        setModal({
                          modal: "customerModal",
                          data: { type: "edit", data: customer },
                        })
                      );
                    }}
                  >
                    <Iconify icon="solar:pen-bold" />
                  </IconButton>
                </Stack>
                <Divider sx={{ mt: 3 }} />
                <Box>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Passport seriyasi"
                        secondary={customer?.passportSeries || "___"}
                      />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem>
                      <ListItemText
                        primary="Telefon raqami"
                        secondary={customer?.phoneNumber || "___"}
                      />
                    </ListItem>
                    <Divider component="li" />

                    <ListItem>
                      <ListItemText
                        primary="Tug'ilgan sana"
                        secondary={
                          customer?.birthDate
                            ? new Date(customer?.birthDate).toLocaleDateString()
                            : "___"
                        }
                      />
                    </ListItem>

                    {customer?.telegramName && (
                      <>
                        <Divider component="li" />
                        <ListItem>
                          <ListItemText
                            primary="Telegram"
                            secondary={`@${customer?.telegramName}`}
                          />
                        </ListItem>
                      </>
                    )}
                    <Divider component="li" />
                    <ListItem>
                      <ListItemText
                        primary="Mas'ul menejer"
                        secondary={
                          <Chip
                            avatar={<Avatar src={undefined} />}
                            label={`${customer?.manager?.firstName || "___"} ${customer?.manager?.lastName || "___"}`}
                            variant="outlined"
                            sx={{ mt: 1 }}
                          />
                        }
                      />
                    </ListItem>
                  </List>
                </Box>
              </>
            )}
          </Grid>
          <Grid xs={12} lg={6}>
            <Box p={2}>
              {customer && (
                <Grid container spacing={1}>
                  <Grid xs={12}>
                    <TextField
                      value={formValues.productName}
                      onChange={handleChange}
                      autoFocus
                      required
                      margin="dense"
                      id="productName"
                      name="productName"
                      label="Mahsulot nomi"
                      fullWidth
                    />
                  </Grid>
                  <Grid xs={6} md={4}>
                    <TextField
                      value={formatNumber(formValues.originalPrice)}
                      onChange={handleNumberChange}
                      required
                      margin="dense"
                      id="originalPrice"
                      name="originalPrice"
                      label="Asl narxi"
                      fullWidth
                    />
                  </Grid>
                  <Grid xs={6} md={4}>
                    <TextField
                      value={formatNumber(formValues.price)}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        handleNumberChange(e);
                        setIsTouched(true);
                      }}
                      required
                      margin="dense"
                      id="price"
                      name="price"
                      label="Sotuv narxi"
                      fullWidth
                    />
                  </Grid>
                  <Grid xs={6} md={4}>
                    <TextField
                      value={formatNumber(formValues.initialPayment)}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        handleNumberChange(e);
                        setIsTouched(true);
                      }}
                      required
                      margin="dense"
                      id="initialPayment"
                      name="initialPayment"
                      label={`Oldindan to'lov`}
                      fullWidth
                    />
                  </Grid>
                  <Grid xs={6} md={4}>
                    <TextField
                      value={formatNumber(formValues.percentage)}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        handleNumberChange(e);
                        setIsTouched(true);
                      }}
                      onBlur={() => {
                        if (
                          !formValues.percentage ||
                          formValues.percentage <= 0
                        ) {
                          setFormValues((prev) => ({ ...prev, percentage: 1 }));
                        }
                      }}
                      required
                      margin="dense"
                      id="percentage"
                      name="percentage"
                      label="Foiz"
                      fullWidth
                    />
                  </Grid>
                  <Grid xs={6} md={4}>
                    <TextField
                      value={formatNumber(formValues.period)}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        handleNumberChange(e);
                        setIsTouched(true);
                      }}
                      onBlur={() => {
                        if (!formValues.period || formValues.period <= 0) {
                          setFormValues((prev) => ({ ...prev, period: 1 }));
                        }
                      }}
                      required
                      margin="dense"
                      id="period"
                      name="period"
                      label="Muddat (oy)"
                      fullWidth
                      inputProps={{ min: 1 }}
                    />
                  </Grid>

                  <Grid xs={6} md={4}>
                    <TextField
                      value={formValues.initialPaymentDueDate}
                      onChange={handleChange}
                      margin="dense"
                      id="initialPaymentDueDate"
                      name="initialPaymentDueDate"
                      label="Birinchi to'lov sanasi"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      required
                      // onKeyDown={(e) => e.preventDefault()}
                    />
                  </Grid>

                  <Grid xs={12}>
                    <Box>
                      <Grid container spacing={1}>
                        <Grid
                          xs={6}
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                              handleMonthlyCalculate();
                              setIsTouched(false);
                            }}
                            // disabled={!isButtonValid}
                            fullWidth
                            size="large"
                          >
                            Oylik to&apos;lov
                          </Button>
                        </Grid>

                        <Grid xs={6}>
                          <TextField
                            value={formatNumber(formValues.monthlyPayment)}
                            onChange={handleNumberChange}
                            onBlur={() => {
                              if (formValues.monthlyPayment === 0) {
                                setIsTouched(true);
                              }
                            }}
                            required
                            margin="dense"
                            id="monthlyPayment"
                            name="monthlyPayment"
                            label={`Oylik to'lov`}
                            fullWidth
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>

                  <Grid xs={12}>
                    <TextField
                      value={formValues.notes}
                      onChange={handleChange}
                      margin="dense"
                      id="notes"
                      name="notes"
                      label="Izoh"
                      fullWidth
                      required
                      multiline
                      rows={3}
                    />
                  </Grid>
                  <Grid xs={12}>
                    <Accordion
                      sx={{
                        mt: 2,
                        bgcolor: grey[300],
                        borderRadius: 1,
                      }}
                    >
                      <AccordionSummary expandIcon={<FaChevronDown />}>
                        <Typography variant="subtitle1">
                          Qo&lsquo;shimcha ma&#39;lumotlar
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container spacing={2}>
                          <Grid xs={6}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={formValues.box}
                                  onChange={handleChange}
                                  name="box"
                                />
                              }
                              label="Karobka"
                            />
                          </Grid>
                          <Grid xs={6}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={formValues.mbox}
                                  onChange={handleChange}
                                  name="mbox"
                                />
                              }
                              label="Muslim karobka"
                            />
                          </Grid>
                          <Grid xs={6}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={formValues.receipt}
                                  onChange={handleChange}
                                  name="receipt"
                                />
                              }
                              label="Tilxat"
                            />
                          </Grid>
                          <Grid xs={6}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={formValues.iCloud}
                                  onChange={handleChange}
                                  name="icloud"
                                />
                              }
                              label="iCloud"
                            />
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  </Grid>

                  <Grid xs={4}>
                    <TextField
                      value={formatNumber(formValues.totalPrice)}
                      margin="dense"
                      id="totalPrice"
                      name="totalPrice"
                      label="Umumiy summa"
                      fullWidth
                      aria-readonly
                      disabled
                    />
                  </Grid>
                  <Grid xs={4}>
                    <TextField
                      value={formatNumber(formValues.remainingAmount)}
                      required
                      margin="dense"
                      id="remainingAmount"
                      name="remainingAmount"
                      label="Qolgan summa"
                      fullWidth
                      aria-readonly
                      disabled
                    />
                  </Grid>
                  <Grid xs={4}>
                    <TextField
                      value={formatNumber(formValues.profitPrice)}
                      required
                      margin="dense"
                      id="profitPrice"
                      name="profitPrice"
                      label="Foyda"
                      fullWidth
                      aria-readonly
                      disabled
                    />
                  </Grid>
                  <Grid xs={6}>
                    <TextField
                      value={formValues.startDate}
                      onChange={handleChange}
                      required
                      margin="dense"
                      id="startDate"
                      name="startDate"
                      label="Shartnoma sanasi"
                      type="date"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      aria-readonly
                      disabled={
                        !(formValues.payments && formValues.payments.length > 0)
                      }
                    />
                  </Grid>
                  <Grid xs={6}>
                    <TextField
                      value={formValues.paymentDeadline}
                      required
                      margin="dense"
                      id="paymentDeadline"
                      name="paymentDeadline"
                      label="To'lov muddati"
                      type="date"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      aria-readonly
                      disabled
                    />
                  </Grid>
                </Grid>
              )}
            </Box>
          </Grid>
          <Grid xs={12}>
            {customer && contractModal.type !== "edit" && (
              <Stack spacing={2}>
                {formValues.payments?.map((payment, idx) => (
                  <Grid container spacing={1} key={idx}>
                    <Grid xs={4}>
                      <TextField
                        label="Sana"
                        type="date"
                        placeholder="oy/kun/yil"
                        value={payment.date}
                        onChange={(e) => {
                          const payments = [...(formValues.payments || [])];
                          payments[idx].date = e.target.value;
                          setFormValues((prev) => ({ ...prev, payments }));
                        }}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        required
                      />
                    </Grid>
                    <Grid xs={3}>
                      <TextField
                        label="Miqdor"
                        value={formatNumber(payment.amount)}
                        onChange={(e) => {
                          const { value } = e.target;
                          const numValue =
                            value === "" ? 0 : Number(value.replace(/\D/g, ""));
                          const payments = [...(formValues.payments || [])];
                          payments[idx].amount = numValue;
                          setFormValues((prev) => ({ ...prev, payments }));
                        }}
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid xs={4}>
                      <TextField
                        label="Izoh"
                        value={payment.note}
                        onChange={(e) => {
                          const payments = [...(formValues.payments || [])];
                          payments[idx].note = e.target.value;
                          setFormValues((prev) => ({ ...prev, payments }));
                        }}
                        fullWidth
                      />
                    </Grid>
                    <Grid xs={1} display="flex" justifyContent="center">
                      <IconButton
                        sx={{ width: "40px", height: "40px" }}
                        color="error"
                        onClick={() => {
                          const payments = [...(formValues.payments || [])];
                          payments.splice(idx, 1); // indexdagi elementni olib tashlash
                          setFormValues((prev) => ({ ...prev, payments }));
                        }}
                      >
                        <MdDelete />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}
                <Button
                  variant="outlined"
                  onClick={() =>
                    setFormValues((prev) => ({
                      ...prev,
                      payments: [
                        ...(prev.payments || []),
                        { date: "", amount: 0, note: "" },
                      ],
                    }))
                  }
                >
                  + To‘lov qo‘shish
                </Button>
              </Stack>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={handleClose}>
          Bekor qilish
        </Button>
        {contractModal.type === "edit" ? (
          <Button
            color="success"
            type="submit"
            disabled={!isFormValid && customer?.isActive}
          >
            Tasdiqlash
          </Button>
        ) : (
          <Button type="submit" disabled={!isFormValid}>
            Saqlash
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ModalContract;
