import type { RootState } from "src/store";
import type { IRole } from "src/types/role";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRoles: IRole;
};

export function ProtectedRoute({
  children,
  requiredRoles,
}: ProtectedRouteProps) {
  const { loggedIn, profile, isLoadingRefresh } = useSelector(
    (state: RootState) => state.auth
  );
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Refresh tugashini kutish
    if (isLoadingRefresh) {
      console.log("⏳ ProtectedRoute: Waiting for refresh to complete...");
      return;
    }

    const token = localStorage.getItem("accessToken");
    const savedProfile = localStorage.getItem("userProfile");

    console.log("🔍 ProtectedRoute check:", {
      hasToken: !!token,
      hasProfile: !!savedProfile,
      loggedIn,
      currentRole: profile.role,
      requiredRole: requiredRoles
    });

    // ✅ Token va profile mavjud bo'lsa, lekin loggedIn false bo'lsa
    // Bu refresh muvaffaqiyatsiz bo'lgan holat - lekin foydalanuvchi login holatida qolishi kerak
    if (token && savedProfile && !loggedIn) {
      console.log("⚠️ ProtectedRoute: Token exists but not logged in - this is OK, user will stay");
      // Bu holatda redirect qilmaslik kerak!
      return;
    }

    // ✅ Token yo'q va login qilinmagan bo'lsa - faqat shu holatda redirect
    if (!token && !loggedIn) {
      console.log("🚫 ProtectedRoute: No token and not logged in, redirecting to login");
      navigate("/", { replace: true });
      return;
    }

    // ✅ Login qilingan, lekin role mos kelmasa
    if (loggedIn && profile.role && requiredRoles !== profile.role) {
      console.log("🚫 ProtectedRoute: Role mismatch", {
        required: requiredRoles,
        actual: profile.role
      });
      navigate("/", { replace: true });
      return;
    }

    // ✅ Login qilingan va role mos kelsa
    if (loggedIn && profile.role === requiredRoles) {
      console.log("✅ ProtectedRoute: Access granted", {
        role: profile.role,
        user: profile.firstname
      });
    }
  }, [profile.role, isLoadingRefresh, loggedIn, navigate, requiredRoles, profile.firstname]);

  // ✅ Refresh jarayonida loader ko'rsatish
  if (isLoadingRefresh) {
    return null; // yoki <Loader />
  }

  return <>{children}</>;
}
