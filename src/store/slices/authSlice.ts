/* eslint-disable @typescript-eslint/no-unused-expressions */
import type { IProfile } from "src/types/admin";
import type { PayloadAction } from "@reduxjs/toolkit";

import { createSlice } from "@reduxjs/toolkit";

export interface AuthState {
  profile: IProfile;
  isLoading: boolean;
  isLoadingRefresh: boolean;
  loggedIn: boolean;
  error: string | null;
}

const initialState: AuthState = {
  profile: {
    firstname: "",
    lastname: "",
    phoneNumber: "",
    telegramId: "",
    role: null,
  },
  isLoading: false,
  isLoadingRefresh: false,
  loggedIn: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    refreshStart(state) {
      state.isLoadingRefresh = true;
      state.error = null;
    },
    refreshSuccess(
      state,
      action: PayloadAction<{
        profile: IProfile;
        accessToken?: string;
        token?: string;
      }>
    ) {
      state.isLoadingRefresh = false;
      state.loggedIn = true;
      state.profile = action.payload.profile;
      state.error = null;

      // ✅ Token va profile'ni localStorage'ga saqlash
      const token = action.payload.accessToken || action.payload.token;
      if (token) {
        localStorage.setItem("accessToken", token);
        localStorage.setItem("userProfile", JSON.stringify(action.payload.profile));
        console.log("✅ Token and profile saved to localStorage after refresh");
      }
    },
    refreshFailure(state, action: PayloadAction<string>) {
      state.isLoadingRefresh = false;
      state.error = action.payload;

      // ✅ Agar localStorage'da token va profile mavjud bo'lsa, foydalanuvchi login holatida qoladi
      const token = localStorage.getItem("accessToken");
      const savedProfile = localStorage.getItem("userProfile");

      console.log("🔍 refreshFailure - localStorage check:", {
        hasToken: !!token,
        hasProfile: !!savedProfile,
        error: action.payload
      });

      if (token && savedProfile) {
        console.log("⚠️ Refresh failed but token exists - restoring user session from localStorage");
        console.log("⚠️ IMPORTANT: localStorage data is NOT cleared!");

        state.loggedIn = true;
        try {
          const parsedProfile = JSON.parse(savedProfile);
          state.profile = parsedProfile;
          console.log("✅ Profile restored:", parsedProfile.firstname, parsedProfile.role);
        } catch (e) {
          console.error("❌ Failed to parse saved profile:", e);
          // Profile parse qilish muvaffaqiyatsiz bo'lsa
          // ⚠️ Lekin localStorage'ni o'chirmaslik - foydalanuvchi qayta login qilishi kerak
          console.log("⚠️ Parse error but keeping localStorage - user needs to re-login manually");
          state.loggedIn = false;
          state.profile = initialState.profile;
          // ❌ localStorage.removeItem() - CHAQIRMASLIK!
        }
      } else {
        console.log("❌ Refresh failed and no token/profile in localStorage");
        state.loggedIn = false;
        state.profile = initialState.profile;
        // ❌ localStorage'ni tozalamaslik - allaqachon bo'sh
      }
    },

    loginStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess(
      state,
      action: PayloadAction<{
        profile: IProfile;
        accessToken?: string;
        token?: string;
      }>
    ) {
      state.isLoading = false;
      state.loggedIn = true;
      state.profile = action.payload.profile;
      state.error = null;

      // ✅ Token va profile'ni localStorage'ga saqlash
      const token = action.payload.accessToken || action.payload.token;
      if (token) {
        localStorage.setItem("accessToken", token);
        localStorage.setItem("userProfile", JSON.stringify(action.payload.profile));
        console.log("✅ Token and profile saved to localStorage after login");
      }
    },

    loginFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },

    logoutUser(state) {
      // ✅ Barcha localStorage ma'lumotlarini tozalash
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userProfile");

      state.loggedIn = false;
      state.isLoading = false;
      state.isLoadingRefresh = false;
      state.profile = initialState.profile;
      state.error = null;

      console.log("🚪 User logged out, all data cleared");
    },
  },
});

export const {
  refreshStart,
  refreshSuccess,
  refreshFailure,

  loginStart,
  loginSuccess,
  logoutUser,
  loginFailure,
} = authSlice.actions;
export default authSlice.reducer;
