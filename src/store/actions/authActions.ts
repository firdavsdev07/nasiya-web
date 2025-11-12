import type { ILoginFormValues } from "src/types/login";

import authApi from "src/server/auth";
import axiosInstance from "src/server/api";

import { enqueueSnackbar } from "../slices/snackbar";
import {
  loginStart,
  logoutUser,
  refreshStart,
  loginSuccess,
  loginFailure,
  refreshFailure,
  refreshSuccess,
} from "../slices/authSlice";

import type { AppThunk } from "../index";

export const refreshProfile = (): AppThunk => async (dispatch) => {
  dispatch(refreshStart());

  try {
    // localStorage'dan ma'lumotlarni olish
    const token = localStorage.getItem("accessToken");
    const savedProfile = localStorage.getItem("userProfile");

    console.log("🔄 Refreshing profile...");
    console.log("📦 localStorage check:", { hasToken: !!token, hasProfile: !!savedProfile });

    // ✅ Agar localStorage'da token va profile bo'lsa, FAQAT ularni ishlatish
    // Refresh API'ga murojaat qilmaslik (401 xatolarini oldini olish)
    if (token && savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        console.log("✅ Using cached data from localStorage (no API call)");
        console.log("✅ Profile:", profile.firstname, profile.role);
        dispatch(refreshSuccess({ profile, accessToken: token }));
        return; // ✅ API'ga murojaat qilmaslik
      } catch (parseError) {
        console.log("⚠️ Failed to parse cached profile");
      }
    }

    // Faqat localStorage'da ma'lumot yo'q bo'lsa API'ga murojaat qilish
    console.log("🌐 No cached data, trying refresh API...");
    console.log("🍪 Cookies:", document.cookie);

    const response = await authApi.get("/auth/refresh");

    console.log("✅ Refresh API successful");
    console.log("📦 Profile data:", response.data.profile);

    dispatch(refreshSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;
    const errorStatus = error.response?.status;

    console.log("❌ Refresh API failed:", errorMessage);
    console.log("❌ Error status:", errorStatus);

    // ✅ localStorage'dan ma'lumotlarni yuklash (fallback)
    const token = localStorage.getItem("accessToken");
    const savedProfile = localStorage.getItem("userProfile");

    if (token && savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        console.log("✅ Fallback: Using cached data from localStorage");
        dispatch(refreshSuccess({ profile, accessToken: token }));
        return; // Xatolikni qaytarmaslik
      } catch (parseError) {
        console.log("❌ Failed to parse cached profile");
      }
    }

    console.log("❌ No cached data available, user will be logged out");
    dispatch(refreshFailure(errorMessage));

    // ❌ 401 xatolikda ham logout qilmaslik!
    // Foydalanuvchi localStorage'dagi ma'lumotlar bilan davom etishi mumkin
  }
};

export const login =
  (data: ILoginFormValues): AppThunk =>
    async (dispatch) => {
      dispatch(loginStart());
      try {
        console.log("🔐 Logging in...");
        const response = await axiosInstance.post("/auth/login", data);

        console.log("✅ Login successful");
        console.log("📦 Response data:", response.data);
        console.log("🍪 Cookies after login:", document.cookie);

        dispatch(loginSuccess(response.data));
      } catch (error: any) {
        const errorMessage = error.response?.data?.message;
        console.log("❌ Login failed:", errorMessage);

        dispatch(
          enqueueSnackbar({
            message: errorMessage,
            options: { variant: "error" },
          })
        );
        dispatch(loginFailure(errorMessage));
      }
    };

// export const refreshUser = (): AppThunk => async (dispatch) => {
//   try {
//     const response = await axiosInstance.get("/auth/refresh");
//     dispatch(signUserSuccess(response.data));
//   } catch (error: any) {
//     const errorMessage = error.response?.data?.message || error.message;

//     dispatch(refreshUserFailure(errorMessage));
//   }
// };

export const logout = (): AppThunk => async (dispatch) => {
  try {
    await axiosInstance.get("/auth/logout");
    dispatch(logoutUser());
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;

    dispatch(loginFailure(errorMessage));
  }
};
