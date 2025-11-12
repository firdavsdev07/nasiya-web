/* eslint-disable react-hooks/exhaustive-deps */
import "src/global.css";

import type { TypedUseSelectorHook } from "react-redux";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Router } from "src/routes/sections";

import { useScrollToTop } from "src/hooks/use-scroll-to-top";

import Loader from "./components/loader/Loader";
import Snackbar from "./components/snackbar/Snankbar";
import { refreshProfile } from "./store/actions/authActions";

import type { RootState, AppDispatch } from "./store";

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export default function App() {
  useScrollToTop();
  const dispatch = useDispatch<AppDispatch>();

  const { isLoadingRefresh, loggedIn } = useTypedSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const savedProfile = localStorage.getItem("userProfile");
    
    console.log("🔍 App.tsx useEffect - Initial mount");
    console.log("📦 Token exists:", !!token);
    console.log("📦 Saved profile exists:", !!savedProfile);
    console.log("👤 Logged in:", loggedIn);
    
    // Agar allaqachon login qilingan bo'lsa, refresh qilmaslik
    if (loggedIn) {
      console.log("✅ Already logged in, skipping refresh");
      return;
    }
    
    // Token va profile mavjud bo'lsa - refresh qilish
    if (token && savedProfile) {
      console.log("🔄 Token and profile exist, attempting refresh...");
      dispatch(refreshProfile());
    } else if (token && !savedProfile) {
      // Token mavjud lekin profile yo'q - bu noto'g'ri holat
      // ⚠️ Lekin token'ni o'chirmaslik - refresh qilishga harakat qilish
      console.log("⚠️ Token exists but no profile - will try refresh anyway");
      dispatch(refreshProfile());
    } else {
      console.log("❌ No token, user will be redirected to login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ✅ Faqat component mount bo'lganda ishga tushadi

  if (isLoadingRefresh) {
    return <Loader />;
  }

  return (
    <>
      <Router />
      <Snackbar />
    </>
  );
}
