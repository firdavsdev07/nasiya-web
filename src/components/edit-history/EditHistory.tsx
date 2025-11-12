import React from "react";
import {
  Box,
  Card,
  Chip,
  Stack,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TableContainer,
} from "@mui/material";
import { format } from "date-fns";
import { uz } from "date-fns/locale";
import { Iconify } from "src/components/iconify";
import type { IContractEdit } from "src/types/contract";

interface EditHistoryProps {
  editHistory: IContractEdit[];
}

const EditHistory: React.FC<EditHistoryProps> = ({ editHistory }) => {
  const formatFieldName = (field: string): string => {
    const fieldNames: Record<string, string> = {
      monthlyPayment: "Oylik to'lov",
      initialPayment: "Boshlang'ich to'lov",
      totalPrice: "Umumiy narx",
      productName: "Mahsulot nomi",
      price: "Sotuv narxi",
      originalPrice: "Asl narxi",
    };
    return fieldNames[field] || field;
  };

  if (!editHistory || editHistory.length === 0) {
    return null;
  }

  return (
    <Card sx={{ p: 2 }}>
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <Iconify icon="mdi:history" width={24} />
        <Typography variant="h6">Tahrirlash Tarixi</Typography>
        <Chip label={`${editHistory.length} ta`} size="small" color="primary" />
      </Box>

      <Stack spacing={2}>
        {editHistory.map((edit, index) => (
          <Accordion key={index} defaultExpanded={index === 0}>
            <AccordionSummary expandIcon={<Iconify icon="mdi:chevron-down" />}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                width="100%"
                pr={2}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <Chip
                    label={`#${editHistory.length - index}`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  <Typography variant="body2" fontWeight="medium">
                    {edit.editedBy.firstName} {edit.editedBy.lastName}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {format(new Date(edit.date), "dd MMM yyyy, HH:mm", {
                    locale: uz,
                  })}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                {/* O'zgarishlar */}
                <Box>
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    color="primary.main"
                  >
                    O'zgarishlar:
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Maydon</TableCell>
                          <TableCell align="right">Eski qiymat</TableCell>
                          <TableCell align="center">→</TableCell>
                          <TableCell align="right">Yangi qiymat</TableCell>
                          <TableCell align="right">Farq</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {edit.changes.map((change, idx) => (
                          <TableRow key={idx}>
                            <TableCell>
                              <Typography variant="body2" fontWeight="medium">
                                {formatFieldName(change.field)}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                ${change.oldValue.toLocaleString()}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Iconify icon="mdi:arrow-right" width={16} />
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" fontWeight="bold">
                                ${change.newValue.toLocaleString()}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Chip
                                label={`${change.difference > 0 ? "+" : ""}${change.difference.toFixed(2)}`}
                                size="small"
                                color={
                                  change.difference > 0 ? "success" : "error"
                                }
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>

                {/* Ta'sir */}
                {edit.impactSummary && (
                  <Box>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      color="primary.main"
                    >
                      Ta'sir:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {edit.impactSummary.underpaidCount > 0 && (
                        <Chip
                          icon={<Iconify icon="mdi:alert-circle" />}
                          label={`${edit.impactSummary.underpaidCount} kam to'langan`}
                          size="small"
                          color="error"
                          variant="outlined"
                        />
                      )}
                      {edit.impactSummary.overpaidCount > 0 && (
                        <Chip
                          icon={<Iconify icon="mdi:check-circle" />}
                          label={`${edit.impactSummary.overpaidCount} ko'p to'langan`}
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      )}
                      {edit.impactSummary.additionalPaymentsCreated > 0 && (
                        <Chip
                          icon={<Iconify icon="mdi:plus-circle" />}
                          label={`${edit.impactSummary.additionalPaymentsCreated} qo'shimcha to'lov`}
                          size="small"
                          color="warning"
                          variant="outlined"
                        />
                      )}
                      {edit.impactSummary.totalShortage > 0 && (
                        <Chip
                          label={`Yetishmayapti: $${edit.impactSummary.totalShortage.toFixed(2)}`}
                          size="small"
                          color="error"
                        />
                      )}
                      {edit.impactSummary.totalExcess > 0 && (
                        <Chip
                          label={`Ortiqcha: $${edit.impactSummary.totalExcess.toFixed(2)}`}
                          size="small"
                          color="success"
                        />
                      )}
                    </Stack>
                  </Box>
                )}
              </Stack>
            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>
    </Card>
  );
};

export default EditHistory;
