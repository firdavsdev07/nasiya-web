/* eslint-disable react-hooks/exhaustive-deps */
import type { RootState } from "src/store";
import type { IContract } from "src/types/contract";

import { useSelector } from "react-redux";
import { useState, useEffect, useCallback, useMemo } from "react";

import Grid from "@mui/material/Unstable_Grid2";
import {
  Box,
  Alert,
  Button,
  Dialog,
  TextField,
  useTheme,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";

import { useAppDispatch } from "src/hooks/useAppDispatch";
import { formatNumber } from "src/utils/format-number";
import { closeModal } from "src/store/slices/modalSlice";
import authApi from "src/server/auth";
import { enqueueSnackbar } from "src/store/slices/snackbar";
import { getContract } from "src/store/actions/contractActions";

import { ImpactSummary } from "src/components/impact-summary";
import type { ImpactSummaryData } from "src/components/impact-summary";

interface IForm {
  monthlyPayment: number;
  initialPayment: number;
  totalPrice: number;
}

interface ContractEditResponse {
  message: string;
  changes: Array<{
    field: string;
    oldValue: number;
    newValue: number;
    difference: number;
  }>;
  impactSummary: ImpactSummaryData;
  affectedPayments: number;
}

const ModalContractEdit = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const { contractModal } = useSelector((state: RootState) => state.modal);
  const contract = contractModal?.data as IContract | undefined;

  const [formValues, setFormValues] = useState<IForm>({
    monthlyPayment: 0,
    initialPayment: 0,
    totalPrice: 0,
  });

  const [impactSummary, setImpactSummary] = useState<ImpactSummaryData | null>(
    null
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Initialize form values from contract
  useEffect(() => {
    if (contract && contractModal?.type === "edit") {
      setFormValues({
        monthlyPayment: contract.monthlyPayment || 0,
        initialPayment: contract.initialPayment || 0,
        totalPrice: contract.totalPrice || 0,
      });
      setImpactSummary(null);
      setValidationErrors([]);
      setShowConfirmation(false);
    }
  }, [contract, contractModal?.type]);

  // Calculate changes
  const changes = useMemo(() => {
    if (!contract) return [];

    const result = [];

    if (formValues.monthlyPayment !== contract.monthlyPayment) {
      result.push({
        field: "monthlyPayment",
        label: "Oylik to'lov",
        oldValue: contract.monthlyPayment,
        newValue: formValues.monthlyPayment,
        difference: formValues.monthlyPayment - contract.monthlyPayment,
      });
    }

    if (formValues.initialPayment !== contract.initialPayment) {
      result.push({
        field: "initialPayment",
        label: "Boshlang'ich to'lov",
        oldValue: contract.initialPayment,
        newValue: formValues.initialPayment,
        difference: formValues.initialPayment - contract.initialPayment,
      });
    }

    if (formValues.totalPrice !== contract.totalPrice) {
      result.push({
        field: "totalPrice",
        label: "Umumiy narx",
        oldValue: contract.totalPrice,
        newValue: formValues.totalPrice,
        difference: formValues.totalPrice - contract.totalPrice,
      });
    }

    return result;
  }, [contract, formValues]);

  const hasChanges = changes.length > 0;

  // Real-time impact analysis
  useEffect(() => {
    if (!contract || !hasChanges) {
      setImpactSummary(null);
      return;
    }

    const analyzeImpact = async () => {
      setIsAnalyzing(true);
      setValidationErrors([]);

      try {
        const response = await authApi.post(
          `/contract/analyze-impact/${contract._id}`,
          {
            monthlyPayment: formValues.monthlyPayment,
            initialPayment: formValues.initialPayment,
            totalPrice: formValues.totalPrice,
          }
        );

        if (response.data.impactSummary) {
          setImpactSummary(response.data.impactSummary);
        }
      } catch (error: any) {
        const errorMessage = error.response?.data?.message;
        const errorMessages: string[] = error.response?.data?.errors;

        if (errorMessage) {
          setValidationErrors([errorMessage]);
        }

        if (Array.isArray(errorMessages)) {
          setValidationErrors(errorMessages);
        }
      } finally {
        setIsAnalyzing(false);
      }
    };

    const debounceTimer = setTimeout(analyzeImpact, 500);
    return () => clearTimeout(debounceTimer);
  }, [contract, formValues, hasChanges]);

  const handleNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const numValue = value === "" ? 0 : Number(value.replace(/\D/g, ""));

      setFormValues((prev) => ({ ...prev, [name]: numValue }));
      setShowConfirmation(false);
    },
    []
  );

  const handleClose = useCallback(() => {
    setFormValues({
      monthlyPayment: 0,
      initialPayment: 0,
      totalPrice: 0,
    });
    setImpactSummary(null);
    setValidationErrors([]);
    setShowConfirmation(false);
    dispatch(closeModal("contractModal"));
  }, [dispatch]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!contract) return;

    if (!showConfirmation) {
      setShowConfirmation(true);
      return;
    }

    setIsSubmitting(true);

    const payload = {
      id: contract._id,
      monthlyPayment: formValues.monthlyPayment,
      initialPayment: formValues.initialPayment,
      totalPrice: formValues.totalPrice,
      // Keep other fields unchanged
      customer: contract.customer?._id,
      productName: contract.productName,
      originalPrice: contract.originalPrice,
      price: contract.price,
      percentage: contract.percentage,
      period: contract.period,
      initialPaymentDueDate: contract.initialPaymentDueDate,
      notes: contract.notes,
      box: contract.info?.box || false,
      mbox: contract.info?.mbox || false,
      receipt: contract.info?.receipt || false,
      iCloud: contract.info?.iCloud || false,
    };

    console.log("🚀 Sending contract update:", {
      contractId: contract._id,
      oldValues: {
        monthlyPayment: contract.monthlyPayment,
        initialPayment: contract.initialPayment,
        totalPrice: contract.totalPrice,
      },
      newValues: {
        monthlyPayment: formValues.monthlyPayment,
        initialPayment: formValues.initialPayment,
        totalPrice: formValues.totalPrice,
      },
      payload,
    });

    try {
      const response = await authApi.put("/contract", payload);

      const result: ContractEditResponse = response.data;

      dispatch(
        enqueueSnackbar({
          message: result.message || "Shartnoma muvaffaqiyatli yangilandi",
          options: { variant: "success" },
        })
      );

      // Refresh contract data
      if (contract._id) {
        dispatch(getContract(contract._id));
      }

      handleClose();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      const errorMessages: string[] = error.response?.data?.errors;

      dispatch(
        enqueueSnackbar({
          message: errorMessage || "Shartnomani yangilashda xatolik",
          options: { variant: "error" },
        })
      );

      if (Array.isArray(errorMessages)) {
        errorMessages.forEach((err) => {
          dispatch(
            enqueueSnackbar({
              message: err,
              options: { variant: "error" },
            })
          );
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    hasChanges &&
    formValues.monthlyPayment > 0 &&
    formValues.initialPayment >= 0 &&
    formValues.totalPrice > formValues.initialPayment &&
    validationErrors.length === 0;

  return (
    <Dialog
      open={contractModal?.type === "edit"}
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
      }}
      maxWidth="md"
      fullWidth
      fullScreen={fullScreen}
    >
      <DialogTitle>Shartnomani Tahrirlash</DialogTitle>
      <DialogContent sx={{ p: { xs: 2, md: 3 } }}>
        {contract && (
          <Box>
            {/* Contract Info */}
            <Box sx={{ mb: 3, p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Shartnoma
              </Typography>
              <Typography variant="h6">{contract.productName}</Typography>
              <Typography variant="body2" color="text.secondary">
                Mijoz: {contract.customer?.firstName}{" "}
                {contract.customer?.lastName}
              </Typography>
            </Box>

            {/* Form Fields */}
            <Grid container spacing={2}>
              <Grid xs={12} md={4}>
                <TextField
                  value={formatNumber(formValues.monthlyPayment)}
                  onChange={handleNumberChange}
                  required
                  fullWidth
                  id="monthlyPayment"
                  name="monthlyPayment"
                  label="Oylik to'lov"
                  helperText={
                    contract.monthlyPayment !== formValues.monthlyPayment
                      ? `Eski: $${contract.monthlyPayment}`
                      : ""
                  }
                />
              </Grid>

              <Grid xs={12} md={4}>
                <TextField
                  value={formatNumber(formValues.initialPayment)}
                  onChange={handleNumberChange}
                  required
                  fullWidth
                  id="initialPayment"
                  name="initialPayment"
                  label="Boshlang'ich to'lov"
                  helperText={
                    contract.initialPayment !== formValues.initialPayment
                      ? `Eski: $${contract.initialPayment}`
                      : ""
                  }
                />
              </Grid>

              <Grid xs={12} md={4}>
                <TextField
                  value={formatNumber(formValues.totalPrice)}
                  onChange={handleNumberChange}
                  required
                  fullWidth
                  id="totalPrice"
                  name="totalPrice"
                  label="Umumiy narx"
                  helperText={
                    contract.totalPrice !== formValues.totalPrice
                      ? `Eski: $${contract.totalPrice}`
                      : ""
                  }
                />
              </Grid>
            </Grid>

            {/* Changes Summary */}
            {hasChanges && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  O'zgarishlar:
                </Typography>
                {changes.map((change) => (
                  <Alert
                    key={change.field}
                    severity="info"
                    sx={{ mb: 1 }}
                    icon={false}
                  >
                    <Typography variant="body2">
                      <strong>{change.label}:</strong> ${change.oldValue} → $
                      {change.newValue}
                      <Typography
                        component="span"
                        color={
                          change.difference > 0 ? "success.main" : "error.main"
                        }
                        sx={{ ml: 1 }}
                      >
                        ({change.difference > 0 ? "+" : ""}
                        {change.difference.toFixed(2)})
                      </Typography>
                    </Typography>
                  </Alert>
                ))}
              </Box>
            )}

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <Box sx={{ mt: 2 }}>
                {validationErrors.map((error, index) => (
                  <Alert key={index} severity="error" sx={{ mb: 1 }}>
                    {error}
                  </Alert>
                ))}
              </Box>
            )}

            {/* Impact Analysis */}
            {isAnalyzing && (
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <CircularProgress size={20} />
                <Typography variant="body2" color="text.secondary">
                  Ta'sir tahlil qilinmoqda...
                </Typography>
              </Box>
            )}

            {!isAnalyzing && impactSummary && (
              <ImpactSummary impact={impactSummary} />
            )}

            {/* Confirmation Warning */}
            {showConfirmation && isFormValid && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  ⚠️ Tasdiqlash
                </Typography>
                <Typography variant="body2">
                  Shartnomani tahrirlashni tasdiqlaysizmi? Bu amal qaytarib
                  bo'lmaydi.
                </Typography>
              </Alert>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button color="error" onClick={handleClose} disabled={isSubmitting}>
          Bekor Qilish
        </Button>
        {!showConfirmation ? (
          <Button
            type="submit"
            variant="contained"
            disabled={!isFormValid || isAnalyzing}
          >
            Davom Etish
          </Button>
        ) : (
          <Button
            type="submit"
            variant="contained"
            color="warning"
            disabled={isSubmitting}
            startIcon={isSubmitting && <CircularProgress size={20} />}
          >
            {isSubmitting ? "Saqlanmoqda..." : "Tasdiqlash va Saqlash"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ModalContractEdit;
