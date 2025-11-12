import authApi from "src/server/auth";
import logger from "src/utils/logger";

import { start, success, setPayments, setError } from "../slices/cashSlice";
import { enqueueSnackbar } from "../slices/snackbar";

import type { AppThunk } from "../index";
import type { IPayment } from "src/types/cash";

// New action: getPendingPayments
export const getPendingPayments = (): AppThunk => async (dispatch) => {
  dispatch(start());
  try {
    logger.log("🔍 Fetching cash/pending payments...");
    const res = await authApi.get("/cash/pending");

    logger.log("📊 === CASH DATA RECEIVED ===");
    logger.log("Response structure:", {
      hasData: !!res.data,
      dataKeys: res.data ? Object.keys(res.data) : [],
      dataType: typeof res.data,
    });

    // Backend returns { success: true, message: "...", data: [], count: 0 }
    let payments: IPayment[] = [];

    if (res.data) {
      // Check if res.data.data exists (standard format)
      if (res.data.data && Array.isArray(res.data.data)) {
        payments = res.data.data;
      }
      // Check if res.data itself is an array (direct format)
      else if (Array.isArray(res.data)) {
        payments = res.data;
      }
      // Check if res.data has a payments property
      else if (res.data.payments && Array.isArray(res.data.payments)) {
        payments = res.data.payments;
      }
      // Fallback: empty array
      else {
        logger.warn("⚠️ Unexpected response format:", res.data);
        payments = [];
      }
    }

    logger.log("Total items:", payments.length);
    logger.log("Data type:", typeof payments);

    if (payments.length > 0) {
      logger.log("✅ Sample payment:", payments[0]);
      logger.log("✅ Sample payment contractId:", payments[0].contractId);
      logger.log("✅ Has contractId?", !!payments[0].contractId);
    } else {
      logger.log("⚠️ No pending payments found");
    }

    dispatch(setPayments(payments));
    logger.log("✅ Payments loaded successfully");
  } catch (error: any) {
    logger.error("❌ Error fetching pending payments:", error);
    const errorMessage =
      error.response?.data?.message || error.message || "Xatolik yuz berdi";
    logger.error("Error details:", error.response?.data || error.message);

    dispatch(setError(errorMessage));
    dispatch(
      enqueueSnackbar({
        message: `To'lovlarni yuklashda xatolik: ${errorMessage}`,
        options: { variant: "error" },
      })
    );
  }
};

// New action: confirmPayments
export const confirmPayments =
  (paymentIds: string[]): AppThunk =>
    async (dispatch) => {
      dispatch(start());
      try {
        logger.log("✅ Confirming payments:", paymentIds);
        const res = await authApi.post("/cash/confirm-payments", { paymentIds });

        logger.log("📊 Confirmation result:", res.data);

        dispatch(success());
        dispatch(
          enqueueSnackbar({
            message: "To'lovlar muvaffaqiyatli tasdiqlandi",
            options: { variant: "success" },
          })
        );

        // Refresh pending payments list
        logger.log("🔄 Refreshing pending payments...");
        dispatch(getPendingPayments());
      } catch (error: any) {
        logger.error("❌ Error confirming payments:", error);
        const errorMessage =
          error.response?.data?.message || error.message || "Xatolik yuz berdi";

        dispatch(setError(errorMessage));
        dispatch(
          enqueueSnackbar({
            message: `To'lovlarni tasdiqlashda xatolik: ${errorMessage}`,
            options: { variant: "error" },
          })
        );
      }
    };

// New action: rejectPayment
export const rejectPayment =
  (paymentId: string, reason: string): AppThunk =>
    async (dispatch) => {
      dispatch(start());
      try {
        logger.log("❌ Rejecting payment:", paymentId, "Reason:", reason);
        const res = await authApi.post("/cash/reject-payment", {
          paymentId,
          reason,
        });

        logger.log("📊 Rejection result:", res.data);

        dispatch(success());
        dispatch(
          enqueueSnackbar({
            message: "To'lov muvaffaqiyatli rad etildi",
            options: { variant: "success" },
          })
        );

        // Refresh pending payments list
        logger.log("🔄 Refreshing pending payments...");
        dispatch(getPendingPayments());
      } catch (error: any) {
        logger.error("❌ Error rejecting payment:", error);
        const errorMessage =
          error.response?.data?.message || error.message || "Xatolik yuz berdi";

        dispatch(setError(errorMessage));
        dispatch(
          enqueueSnackbar({
            message: `To'lovni rad etishda xatolik: ${errorMessage}`,
            options: { variant: "error" },
          })
        );
      }
    };
