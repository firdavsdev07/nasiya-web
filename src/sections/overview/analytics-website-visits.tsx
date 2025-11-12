import type { RootState } from "src/store";
import type { SelectChangeEvent } from "@mui/material";
import type { ChartOptions } from "src/components/chart";

import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import { Select, MenuItem, FormControl } from "@mui/material";
import { useTheme, alpha as hexAlpha } from "@mui/material/styles";

import { useAppDispatch } from "src/hooks/useAppDispatch";

import { setGranularity } from "src/store/slices/dashboardSlice";
import { getStatistic } from "src/store/actions/dashboardActions";

import { Chart, useChart } from "src/components/chart";

// ----------------------------------------------------------------------

type ChartType = {
  colors?: string[];
  categories?: string[];
  series: {
    name: string;
    data: number[];
  }[];
  options?: ChartOptions;
};

export function AnalyticsWebsiteVisits() {
  const dispatch = useAppDispatch();
  const { statistic, selectedGranularity } = useSelector(
    (state: RootState) => state.dashboard
  );

  const [localGranularity, setLocalGranularity] = useState(selectedGranularity);

  const selectedStatistic = statistic[localGranularity];

  // Debug logging
  console.log("Analytics component:", {
    localGranularity,
    selectedStatistic,
    statistic,
  });

  useEffect(() => {
    console.log("Fetching statistic for:", localGranularity);
    if (!selectedStatistic) {
      dispatch(getStatistic(localGranularity));
    }
  }, [dispatch, localGranularity, selectedStatistic]);

  const handleGranularityChange = (event: SelectChangeEvent) => {
    const value = event.target.value as "daily" | "monthly" | "yearly";
    setLocalGranularity(value);
    dispatch(setGranularity(value));
  };
  const chart: ChartType = {
    categories: selectedStatistic?.categories || [],
    series: [
      {
        name: "To'lov",
        data:
          selectedStatistic?.series?.map((num: number) =>
            Number(num.toFixed(2))
          ) || [],
      },
    ],
  };

  const theme = useTheme();

  const chartColors = chart.colors ?? [
    theme.palette.primary.dark,
    hexAlpha(theme.palette.primary.light, 0.64),
  ];

  const chartOptions = useChart({
    colors: chartColors,
    stroke: {
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: chart.categories,
    },
    legend: {
      show: true,
    },
    tooltip: {
      y: {
        formatter: (value: number) => `${value} $`,
      },
    },
    ...chart.options,
  });

  return (
    <Card sx={{ height: "100%" }}>
      <CardHeader title="To'lovlar tarixi" />
      <FormControl fullWidth sx={{ px: 2 }}>
        {/* <InputLabel id="granularity-select-label">Kesim</InputLabel> */}
        <Select
          labelId="granularity-select-label"
          value={localGranularity}
          // label="Kesim"
          onChange={handleGranularityChange}
        >
          <MenuItem value="daily">Kunlik</MenuItem>
          <MenuItem value="monthly">Oylik</MenuItem>
          <MenuItem value="yearly">Yillik</MenuItem>
        </Select>
      </FormControl>
      {selectedStatistic && chart.categories && chart.categories.length > 0 ? (
        <Chart
          type="bar"
          series={chart.series}
          options={chartOptions}
          height={364}
          sx={{ py: 2.5, pl: 1, pr: 2.5 }}
        />
      ) : (
        <div
          style={{
            height: 364,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Ma&apos;lumotlar yuklanmoqda...
        </div>
      )}
    </Card>
  );
}
