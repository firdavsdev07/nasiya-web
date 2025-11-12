import Grid from "@mui/material/Unstable_Grid2";
import { Card, Typography } from "@mui/material";

import { Label } from "../label";

interface StatCardProps {
  title: string;
  value: number;
  lastMonthValue: number;
  isCurrency?: boolean;
  changeText: string;
}

const StatCard = ({
  title,
  value,
  lastMonthValue,
  isCurrency = false,
  changeText,
}: StatCardProps) => {
  const formattedValue = isCurrency
    ? `${value.toLocaleString()} so'm`
    : value.toLocaleString();

  return (
    <Grid xs={12} sm={6} md={3}>
      <Card
        sx={{
          p: 2,
          boxShadow: 3,
          display: "flex",
          gap: 2,
          flexDirection: "column",
     
        }}
      >
        <Typography
          variant="subtitle2"
          color="textSecondary"
          display="flex"
          justifyContent="space-between"
        >
          {title}
          <Label color={changeText.includes("+") ? "success" : "warning"}>
            <span
              style={{
                color: changeText.includes("+") ? "green" : "red",
                fontWeight: "bold",
              }}
            >
              {changeText}
            </span>
          </Label>
        </Typography>
        <Typography variant="h5" fontWeight="bold">
          {formattedValue}
        </Typography>
      </Card>
    </Grid>
  );
};

export default StatCard;
