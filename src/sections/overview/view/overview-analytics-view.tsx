import type { RootState } from "src/store";

import { useEffect } from "react";
import { useSelector } from "react-redux";

import { Skeleton, Box } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";

import { useAppDispatch } from "src/hooks/useAppDispatch";

import { formatNumber } from "src/utils/format-number";

import { DashboardContent } from "src/layouts/dashboard";
import {
  getDashboard,
  getCurrencyCourse,
} from "src/store/actions/dashboardActions";

import Loader from "src/components/loader/Loader";

import { AnalyticsCurrentVisits } from "../analytics-current-visits";
import { AnalyticsWebsiteVisits } from "../analytics-website-visits";
import { AnalyticsWidgetSummary } from "../analytics-widget-summary";

export function OverviewAnalyticsView() {
  const dispatch = useAppDispatch();
  const { dashboard, isLoading, isLoadingStatistic } = useSelector(
    (state: RootState) => state.dashboard
  );
  const { currency } = useSelector((state: RootState) => state.dashboard);

  // Debug logging
  console.log("Dashboard data:", dashboard);
  console.log("Currency:", currency);
  console.log("Loading states:", { isLoading, isLoadingStatistic });

  useEffect(() => {
    dispatch(getDashboard());
    dispatch(getCurrencyCourse());

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      dispatch(getDashboard());
    }, 30000);

    return () => clearInterval(interval);
  }, [dispatch]);

  if (dashboard == null && isLoading) {
    return <Loader />;
  }
  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Dashbord
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3} sx={{ height: "100%" }}>
          <AnalyticsWidgetSummary
            title="Jami Xodimlar Soni"
            total={dashboard?.employees || 0}
            color="secondary"
            icon={
              <img alt="icon" src="/assets/icons/glass/ic-glass-users.svg" />
            }
          />
        </Grid>
        <Grid xs={12} sm={6} md={3} sx={{ height: "100%" }}>
          <AnalyticsWidgetSummary
            title="Jami mijozlar soni"
            total={dashboard?.customers || 0}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-buy.svg" />}
          />
        </Grid>
        <Grid xs={12} sm={6} md={3} sx={{ height: "100%" }}>
          <AnalyticsWidgetSummary
            title="Jami shartnomalar soni"
            total={dashboard?.contracts || 0}
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-bag.svg" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3} sx={{ height: "100%" }}>
          <AnalyticsWidgetSummary
            title="Yopilmagan to'lovlar"
            total={dashboard?.debtors || 0}
            color="error"
            icon={
              <img alt="icon" src="/assets/icons/glass/ic-glass-message.svg" />
            }
          />
        </Grid>

        <Grid xs={12} sm={6} md={3} sx={{ height: "100%" }}>
          <AnalyticsWidgetSummary
            title="Balans ($)"
            total={dashboard?.totalBalance.dollar || 0}
            color="success"
            icon={<img alt="icon" src="/assets/icons/glass/currency.png" />}
          />
        </Grid>
        <Grid xs={12} sm={6} md={3} sx={{ height: "100%" }}>
          {dashboard?.totalBalance.hasCurrencyRate &&
          dashboard?.totalBalance.sum !== null ? (
            <AnalyticsWidgetSummary
              title="Balans (sum)"
              total={dashboard.totalBalance.sum}
              color="success"
              icon={<img alt="icon" src="/assets/icons/glass/currency.png" />}
            />
          ) : (
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: "warning.lighter",
                border: "1px dashed",
                borderColor: "warning.main",
                textAlign: "center",
              }}
            >
              <Typography variant="h6" color="warning.main" gutterBottom>
                Balans (sum)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Dollar kursini to'g'irlang
              </Typography>
            </Box>
          )}
        </Grid>

        <Grid xs={12} sm={6} md={3} sx={{ height: "100%" }}>
          <AnalyticsWidgetSummary
            title="Dollar kurs"
            total={currency}
            color="info"
            currency={currency}
            icon={
              <img
                alt="icon"
                src="/assets/icons/glass/currency.png"
                style={{ width: 40, height: 40 }}
              />
            }
          />
        </Grid>
        <Grid
          xs={12}
          sm={6}
          md={3}
          sx={{ height: "100%" }}
          display="flex"
          alignItems="center"
        >
          <AnalyticsWidgetSummary
            title="Dollar kurs"
            total={currency}
            color="info"
            currency={currency}
            icon={
              <img
                alt="icon"
                src="/assets/icons/glass/currency.png"
                style={{ width: 40, height: 40 }}
              />
            }
            node
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AnalyticsCurrentVisits
            title={`Jami Summa ${formatNumber(dashboard?.financial.totalContractPrice || 0)}$`}
            chart={{
              series: [
                {
                  label: "Boshlang'ich Summa",
                  value: dashboard?.financial.initialPayment || 0,
                },
                {
                  label: "To'langan Summa",
                  value: dashboard?.financial.paidAmount || 0,
                },
                {
                  label: "Qoldiq Summa",
                  value: dashboard?.financial.remainingDebt || 0,
                },
              ],
            }}
          />
        </Grid>
        <Grid xs={12} md={8}>
          {!isLoadingStatistic ? (
            <AnalyticsWebsiteVisits />
          ) : (
            <Skeleton variant="rounded" width="100%" height="100%" />
          )}
        </Grid>

        {/* Payment history table removed - only chart needed */}
      </Grid>
    </DashboardContent>
  );
}
