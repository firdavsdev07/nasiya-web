import React from "react";
import { Alert, Box, Stack, Typography, Chip } from "@mui/material";
import { Iconify } from "src/components/iconify";

export interface ImpactSummaryData {
  underpaidCount: number;
  overpaidCount: number;
  totalShortage: number;
  totalExcess: number;
  additionalPaymentsCreated: number;
}

interface ImpactSummaryProps {
  impact: ImpactSummaryData | null;
}

const ImpactSummary: React.FC<ImpactSummaryProps> = ({ impact }) => {
  if (!impact) return null;

  const hasUnderpaid = impact.underpaidCount > 0;
  const hasOverpaid = impact.overpaidCount > 0;

  if (!hasUnderpaid && !hasOverpaid) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        <Typography variant="body2">
          Hech qanday to'lovga ta'sir qilmaydi
        </Typography>
      </Alert>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        ⚠️ TA'SIR TAHLILI
      </Typography>

      <Stack spacing={2}>
        {hasUnderpaid && (
          <Alert severity="error" icon={<Iconify icon="mdi:alert-circle" />}>
            <Stack spacing={1}>
              <Typography variant="subtitle2" fontWeight="bold">
                {impact.underpaidCount} ta to'lov kam to'langan
              </Typography>
              <Typography variant="body2">
                Jami yetishmayapti:{" "}
                <strong>${impact.totalShortage.toFixed(2)}</strong>
              </Typography>
              <Typography variant="body2">
                {impact.additionalPaymentsCreated} ta qo'shimcha to'lov
                yaratiladi
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Chip
                  label={`${impact.additionalPaymentsCreated} qo'shimcha to'lov`}
                  color="error"
                  size="small"
                  icon={<Iconify icon="mdi:plus-circle" />}
                />
              </Box>
            </Stack>
          </Alert>
        )}

        {hasOverpaid && (
          <Alert severity="success" icon={<Iconify icon="mdi:check-circle" />}>
            <Stack spacing={1}>
              <Typography variant="subtitle2" fontWeight="bold">
                {impact.overpaidCount} ta to'lov ko'p to'langan
              </Typography>
              <Typography variant="body2">
                Jami ortiqcha: <strong>${impact.totalExcess.toFixed(2)}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ortiqcha summa keyingi oylarga o'tkaziladi
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Chip
                  label="Kaskad logika qo'llaniladi"
                  color="success"
                  size="small"
                  icon={<Iconify icon="mdi:arrow-right-circle" />}
                />
              </Box>
            </Stack>
          </Alert>
        )}
      </Stack>
    </Box>
  );
};

export default ImpactSummary;
