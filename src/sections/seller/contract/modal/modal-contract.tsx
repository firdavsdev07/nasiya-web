/* eslint-disable react-hooks/exhaustive-deps */
import type { RootState } from "src/store";
import type { ICustomer } from "src/types/customer";
import type { IAddContract } from "src/types/contract";

import { useSelector } from "react-redux";
import { FaChevronDown } from "react-icons/fa";
import { MdCancel, MdCheckCircle } from "react-icons/md";
import { useMemo, useState, useEffect, useCallback } from "react";

import Grid from "@mui/material/Unstable_Grid2";
import {
  Box,
  List,
  Chip,
  Stack,
  Button,
  Dialog,
  Avatar,
  Tooltip,
  Divider,
  useTheme,
  ListItem,
  Checkbox,
  Accordion,
  TextField,
  Typography,
  DialogTitle,
  ListItemText,
  Autocomplete,
  DialogActions,
  DialogContent,
  useMediaQuery,
  CircularProgress,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  createFilterOptions,
} from "@mui/material";

import { useAppDispatch } from "src/hooks/useAppDispatch";

import { formatNumber } from "src/utils/format-number";

import { grey } from "src/theme/core";
import { setCustomer } from "src/store/slices/customerSlice";
import { setModal, closeModal } from "src/store/slices/modalSlice";
import {
  addContractSeller,
  updateSellerContract,
} from "src/store/actions/contractActions";
import { getSelectCustomers } from "src/store/actions/customerActions";

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
  const { selectCustomers, selectCustomer, customer, isLoading } = useSelector(
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

  // Edit rejimida ma'lumotlarni yuklash
  useEffect(() => {
    if (contractModal?.type === "edit" && contractModal?.data) {
      const contractData = contractModal.data;

      // Customer ma'lumotlarini yuklash
      if (typeof contractData.customer === "object" && contractData.customer) {
        dispatch(setCustomer(contractData.customer));
      }

      setFormValues({
        customer:
          typeof contractData.customer === "string"
            ? contractData.customer
            : contractData.customer?._id,
        productName: contractData.productName || "",
        originalPrice: contractData.originalPrice || 0,
        price: contractData.price || 0,
        initialPayment: contractData.initialPayment || 0,
        percentage: contractData.percentage || 30,
        period: contractData.period || 12,
        initialPaymentDueDate:
          contractData.initialPaymentDueDate?.split("T")[0] ||
          defaultInitialDate.toISOString().split("T")[0],
        monthlyPayment: contractData.monthlyPayment || 0,
        notes: contractData.notes || "",
        box: contractData.info?.box || false,
        mbox: contractData.info?.mbox || false,
        receipt: contractData.info?.receipt || false,
        iCloud: contractData.info?.iCloud || false,
        totalPrice: contractData.totalPrice || 0,
        remainingAmount: contractData.remainingDebt || 0,
        profitPrice: 0,
        startDate:
          contractData.startDate?.split("T")[0] ||
          now.toISOString().split("T")[0],
        paymentDeadline: defaultEndDate.toISOString().split("T")[0],
      });
      setIsTouched(false);
    }
  }, [contractModal, defaultInitialDate, defaultEndDate, now, dispatch]);

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
    // FORMULA:
    // 1. Qolgan summa = Sotuv narxi - Initial Payment
    // 2. Foizli summa = Qolgan + (Qolgan × Foiz / 100)
    // 3. Oylik to'lov = Foizli summa / Muddat
    // 4. Umumiy narx = Initial Payment + (Oylik × Muddat)

    const remainingPrice = formValues.price - formValues.initialPayment;
    const withInterest =
      remainingPrice + (remainingPrice * formValues.percentage) / 100;
    const monthly = withInterest / formValues.period;

    const calculatedMonthly = Number(monthly.toFixed(2));
    const calculatedTotal =
      formValues.initialPayment + calculatedMonthly * formValues.period;

    console.log("📊 Hisob-kitob:", {
      "Sotuv narxi": formValues.price,
      "Initial Payment": formValues.initialPayment,
      Qolgan: remainingPrice,
      Foiz: formValues.percentage + "%",
      "Foizli summa": withInterest,
      Muddat: formValues.period + " oy",
      "Oylik to'lov": calculatedMonthly,
      "Umumiy narx": calculatedTotal,
    });

    setFormValues((prev) => ({
      ...prev,
      monthlyPayment: calculatedMonthly,
      totalPrice: calculatedTotal,
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

      if (contractModal?.type === "edit" && contractModal?.data?._id) {
        dispatch(
          updateSellerContract({
            ...formJson,
            id: contractModal.data._id,
          } as any)
        );
      } else {
        dispatch(addContractSeller(formJson as unknown as IAddContract));
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
      formValues.profitPrice >= 0 &&
      formValues.initialPaymentDueDate !== "" &&
      formValues.notes.trim() !== "" &&
      formValues.price >= formValues.originalPrice &&
      !isTouched,
    [formValues, isTouched]
  );

  useEffect(() => {
    if (!formValues.initialPaymentDueDate) return;
    const baseDate = new Date(formValues.initialPaymentDueDate);
    baseDate.setMonth(baseDate.getMonth() + formValues.period);
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
          ? "Shartnomani tahrirlash"
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
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={handleClose}>
          Bekor qilish
        </Button>
        <Button type="submit" disabled={!isFormValid}>
          Saqlash
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalContract;
