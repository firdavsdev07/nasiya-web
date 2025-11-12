import Grid from "@mui/material/Unstable_Grid2";

import StatCard from "./StatCard";

import type { TableData } from "./types";

interface TableStatsProps<T extends TableData> {
  data: T[];
  lastMonthData: {
    contracts: number;
    totalRevenue: number;
    avgMonthlyPayment: number;
    totalDebt: number;
  };
  calculateTotal: (data: T[], key: keyof T) => number;
}

export function TableStats<T extends TableData>({
  data,
  lastMonthData,
  calculateTotal,
}: TableStatsProps<T>) {
  const totalRevenue = calculateTotal(data, "price");
  const avgMonthlyPayment =
    data.length > 0
      ? Math.round(calculateTotal(data, "monthlyPayment") / data.length)
      : 0;
  const totalDebt = calculateTotal(data, "remainingAmount");

  return (
    <Grid container spacing={1}>
      <StatCard
        title="Jami Shartnomalar"
        value={data.length}
        lastMonthValue={lastMonthData.contracts}
        changeText={`${data.length > lastMonthData.contracts ? "+" : ""}${Math.round(
          ((data.length - lastMonthData.contracts) /
            (lastMonthData.contracts || 1)) *
            100
        )}%`}
      />
      <StatCard
        title="Jami Daromad"
        value={totalRevenue}
        lastMonthValue={lastMonthData.totalRevenue}
        isCurrency
        changeText={`${totalRevenue > lastMonthData.totalRevenue ? "+" : ""}${Math.round(
          ((totalRevenue - lastMonthData.totalRevenue) /
            (lastMonthData.totalRevenue || 1)) *
            100
        )}%`}
      />
      <StatCard
        title="O'rtacha Oylik To'lov"
        value={avgMonthlyPayment}
        lastMonthValue={lastMonthData.avgMonthlyPayment}
        isCurrency
        changeText={`${
          avgMonthlyPayment > lastMonthData.avgMonthlyPayment ? "+" : ""
        }${Math.round(
          ((avgMonthlyPayment - lastMonthData.avgMonthlyPayment) /
            (lastMonthData.avgMonthlyPayment || 1)) *
            100
        )}%`}
      />
      <StatCard
        title="Jami Qarz"
        value={totalDebt}
        lastMonthValue={lastMonthData.totalDebt}
        isCurrency
        changeText={`${totalDebt > lastMonthData.totalDebt ? "+" : ""}${Math.round(
          ((totalDebt - lastMonthData.totalDebt) /
            (lastMonthData.totalDebt || 1)) *
            100
        )}%`}
      />
    </Grid>
  );
}
