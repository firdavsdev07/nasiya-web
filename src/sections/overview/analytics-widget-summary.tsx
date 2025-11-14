import type { CardProps } from "@mui/material/Card";
import type { ColorType } from "src/theme/core/palette";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { useTheme } from "@mui/material/styles";
import { Stack, IconButton } from "@mui/material";

import { useAppDispatch } from "src/hooks/useAppDispatch";

import { formatNumber } from "src/utils/format-number";

import { setModal } from "src/store/slices/modalSlice";
import { varAlpha, bgGradient } from "src/theme/styles";

import { Iconify } from "src/components/iconify";
import { SvgColor } from "src/components/svg-color";

// ----------------------------------------------------------------------

type Props = CardProps & {
  title: string;
  total: number;
  currency?: number;
  // percent: number;
  color?: ColorType;
  icon: React.ReactNode;
  // chart: {
  //   series: number[];
  //   categories: string[];
  //   options?: ChartOptions;
  // };
  node?: React.ReactNode;
};

export function AnalyticsWidgetSummary({
  icon,
  title,
  total,
  currency,
  // chart,
  // percent,
  color = "primary",
  sx,
  node,
  ...other
}: Props) {
  const dispatch = useAppDispatch();
  const theme = useTheme();

  return (
    <Card
      sx={{
        minHeight: { xs: 140, sm: 160, md: 180 },
        width: "100%",
        ...bgGradient({
          color: `135deg, ${varAlpha(theme.vars.palette[color].lighterChannel, 0.48)}, ${varAlpha(theme.vars.palette[color].lightChannel, 0.48)}`,
        }),
        p: { xs: 2, sm: 2.5, md: 3 },
        boxShadow: "none",
        position: "relative",
        color: `${color}.darker`,
        backgroundColor: "common.white",
        ...sx,
      }}
      {...other}
    >
      {node ? (
        <a
          href="https://bank.uz/currency/cb.html"
          title="Bank.uz - O'zbekiston banklari to'g'risida barcha ma'lumotlar"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src="https://bank.uz/scripts/informer"
            alt="Dollar kursi"
            style={{
              maxWidth: "100%",
              height: "auto",
              borderRadius: 8,
            }}
          />
        </a>
      ) : (
        <>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="start"
          >
            <Box sx={{ width: { xs: 36, sm: 42, md: 48 }, height: { xs: 36, sm: 42, md: 48 }, mb: { xs: 2, sm: 2.5, md: 3 } }}>{icon}</Box>
            {currency !== undefined && currency >= 0 && (
              <IconButton
                aria-label="edit"
                size="small"
                onClick={() => {
                  dispatch(
                    setModal({
                      modal: "dashboardModal",
                      data: { type: "edit", data: currency },
                    })
                  );
                }}
              >
                <Iconify icon="solar:pen-bold" />
              </IconButton>
            )}
          </Stack>

          {/* {renderTrending} */}

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-end",
              justifyContent: "flex-end",
            }}
          >
            <Box sx={{ flexGrow: 1, minWidth: { xs: 80, sm: 100, md: 112 } }}>
              <Box sx={{ mb: 1, typography: "subtitle2", fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>{title}</Box>
              <Box sx={{ typography: "h4", fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" } }}>{formatNumber(total)}</Box>
            </Box>

            {/* <Chart
          type="line"
          series={[{ data: chart.series }]}
          options={chartOptions}
          width={84}
          height={56}
        /> */}
          </Box>

          <SvgColor
            src=""
            sx={{
              top: 0,
              left: -20,
              width: 240,
              zIndex: -1,
              height: 240,
              opacity: 0.24,
              position: "absolute",
              color: `${color}.main`,
            }}
          />
        </>
      )}
    </Card>
  );
}
