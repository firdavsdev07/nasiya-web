import { lazy, Suspense } from "react";
import { Outlet, Navigate, useRoutes } from "react-router-dom";

import { AuthLayout } from "src/layouts/auth";
import AccessDenied from "src/pages/AccessDenied";
// import { Redirect } from "src/layouts/redirect/layout";
import { DashboardLayout } from "src/layouts/dashboard";
import { ProtectedRoute } from "src/layouts/permission/layout";

import Loader from "src/components/loader/Loader";
// import { SignInView } from "src/sections/auth";

// ----------------------------------------------------------------------
// seller
export const SellerCustomer = lazy(() => import("src/pages/seller/user"));
export const SellerContract = lazy(() => import("src/pages/seller/contract"));

export const HomePage = lazy(() => import("src/pages/home"));
// export const MenegerPage = lazy(() => import("src/pages/meneger"));
export const EmployeePage = lazy(() => import("src/pages/employee"));
export const UserPage = lazy(() => import("src/pages/user"));
export const CreditsPage = lazy(() => import("src/pages/contract"));
export const DebtorsPage = lazy(() => import("src/pages/debtors"));
export const CashPage = lazy(() => import("src/pages/cash"));
// export const TutorialsPage = lazy(() => import("src/pages/tutorials"));
// export const ServicePage = lazy(() => import("src/pages/service"));
// export const ChannelPage = lazy(() => import("src/pages/channel"));
// export const ContactPage = lazy(() => import("src/pages/contact"));
export const SignInPage = lazy(() => import("src/pages/sign-in"));
export const Page404 = lazy(() => import("src/pages/page-not-found"));

// ----------------------------------------------------------------------

const renderFallback = <Loader />;

export function Router() {
  return useRoutes([
    {
      path: "/admin",
      element: (
        <ProtectedRoute requiredRoles="admin">
          <DashboardLayout>
            <Suspense fallback={renderFallback}>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </ProtectedRoute>
      ),
      children: [
        { element: <HomePage />, index: true },
        // { path: "meneger", element: <MenegerPage /> },
        { path: "employee", element: <EmployeePage /> },
        { path: "user", element: <UserPage /> },
        { path: "contract", element: <CreditsPage /> },
        { path: "debtors", element: <DebtorsPage /> },
        { path: "cash", element: <CashPage /> },
        // { path: "service", element: <ServicePage /> },
        // { path: "channel", element: <ChannelPage /> },
        // { path: "contact", element: <ContactPage /> },
      ],
    },
    {
      path: "/moderator",
      element: (
        <ProtectedRoute requiredRoles="moderator">
          <DashboardLayout>
            <Suspense fallback={renderFallback}>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </ProtectedRoute>
      ),
      children: [
        { element: <HomePage />, index: true },
        // { path: "meneger", element: <MenegerPage /> },
        { path: "employee", element: <EmployeePage /> },
        { path: "user", element: <UserPage /> },
        { path: "contract", element: <CreditsPage /> },
        { path: "debtors", element: <DebtorsPage /> },
        { path: "cash", element: <CashPage /> },
        // { path: "service", element: <ServicePage /> },
        // { path: "channel", element: <ChannelPage /> },
        // { path: "contact", element: <ContactPage /> },
      ],
    },
    {
      path: "/seller",
      element: (
        <ProtectedRoute requiredRoles="seller">
          <DashboardLayout>
            <Suspense fallback={renderFallback}>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </ProtectedRoute>
      ),
      children: [
        // { element: <HomePage />, index: true },
        { element: <SellerCustomer />, index: true },
        { path: "contract", element: <SellerContract /> },
      ],
    },
    {
      path: "/manager",
      element: (
        <ProtectedRoute requiredRoles="manager">
          <DashboardLayout>
            <Suspense fallback={renderFallback}>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </ProtectedRoute>
      ),
      children: [
        { element: <HomePage />, index: true },
        { path: "user", element: <UserPage /> },
        { path: "contract", element: <CreditsPage /> },
        { path: "debtors", element: <DebtorsPage /> },
        { path: "cash", element: <CashPage /> },
      ],
    },
    {
      path: "/",
      element: (
        <AuthLayout>
          <SignInPage />
        </AuthLayout>
      ),
    },
    {
      path: "404",
      element: <Page404 />,
    },
    {
      path: "*",
      element: <Navigate to="/404" replace />,
    },
  ]);
}
