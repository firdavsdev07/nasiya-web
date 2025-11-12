import authApi from "src/server/auth";

import { enqueueSnackbar } from "../slices/snackbar";
import {
  start,
  failure,
  success,
  setCurrency,
  setDashboard,
  setStatistic,
} from "../slices/dashboardSlice";

import type { AppThunk } from "../index";
import type { IStatistic } from "../slices/dashboardSlice";

export const getDashboard = (): AppThunk => async (dispatch) => {
  dispatch(start());
  try {
    console.log("Fetching dashboard data...");
    const res = await authApi.get("/dashboard");
    const { data } = res;
    console.log("Dashboard API response:", data);
    dispatch(setDashboard(data.data));
  } catch (error: any) {
    console.error("Dashboard API error:", error);
    dispatch(failure());
  }
};

export const getStatistic =
  (granularity: "daily" | "monthly" | "yearly"): AppThunk =>
  async (dispatch) => {
    dispatch(start());
    try {
      console.log("Fetching statistic for granularity:", granularity);
      const res = await authApi.get(
        `/dashboard/statistic?range=${granularity}`
      );
      const { data }: { data: IStatistic } = res;
      console.log("Statistic API response:", data);
      dispatch(setStatistic({ granularity, data }));
    } catch (error: any) {
      console.error("Statistic API error:", error);
      dispatch(failure());
    }
  };

export const getCurrencyCourse = (): AppThunk => async (dispatch) => {
  dispatch(start());
  try {
    const res = await authApi.get("/dashboard/currency-course");
    const { data } = res;
    dispatch(setCurrency(data));
    dispatch(success());
  } catch (error: any) {
    dispatch(failure());
  }
};

export const changeCurrency =
  (currency: number): AppThunk =>
  async (dispatch) => {
    dispatch(start());
    try {
      const res = await authApi.put("/dashboard/currency-course", { currency });
      dispatch(getCurrencyCourse());
      dispatch(success());
      dispatch(
        enqueueSnackbar({
          message: res.data.message || "ok",
          options: { variant: "success" },
        })
      );
    } catch (error: any) {
      dispatch(failure());
      const errorMessage = error.response?.data?.message || "server xatoligi";
      const errorMessages: string[] = error.response?.data?.errors || [
        "server xatoligi",
      ];
      dispatch(
        enqueueSnackbar({
          message: errorMessage,
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
    }
  };
