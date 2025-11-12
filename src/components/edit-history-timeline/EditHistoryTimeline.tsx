import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Box,
  Typography,
  Stack,
  Chip,
  Paper,
  Link,
  Divider,
} from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from "@mui/lab";
import { format } from "date-fns";
import { Iconify } from "src/components/iconify";

interface ContractChange {
  field: string;
  oldValue: number;
  newValue: number;
  difference: number;
}

interface ImpactSummary {
  underpaidCount: number;
  overpaidCount: number;
  totalShortage: number;
  totalExcess: number;
  additionalPaymentsCreated: number;
}

interface EditHistoryItem {
  date: string;
  editedBy: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  changes: ContractChange[];
  affectedPayments: string[];
  impactSummary: ImpactSummary;
}

interface EditHistoryTimelineProps {
  editHistory: EditHistoryItem[];
  title?: string;
}

const EditHistoryTimeline: React.FC<EditHistoryTimelineProps> = ({
  editHistory,
  title = "Tahrirlash Tarixi",
}) => {
  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), "dd.MM.yyyy HH:mm");
  };

  const formatFieldName = (field: string): string => {
    const fieldNames: Record<string, string> = {
      monthlyPayment: "Oylik to'lov",
      initialPayment: "Boshlang'ich to'lov",
      totalPrice: "Umumiy narx",
    };
    return fieldNames[field] || field;
  };

  if (!editHistory || editHistory.length === 0) {
    return (
      <Card>
        <CardHeader title={title} />
        <CardContent>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Tahrirlash tarixi mavjud emas
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title={title}
        avatar={<Iconify icon="mdi:history" width={24} />}
        subheader={`${editHistory.length} ta tahrirlash`}
      />
      <CardContent>
        <Timeline position="right">
          {editHistory.map((edit, index) => (
            <TimelineItem key={index}>
              <TimelineOppositeContent
                color="text.secondary"
                sx={{ flex: 0.3 }}
              >
                <Typography variant="caption">
                  {formatDateTime(edit.date)}
                </Typography>
                <Typography variant="caption" display="block">
                  {edit.editedBy.firstName} {edit.editedBy.lastName}
                </Typography>
              </TimelineOppositeContent>

              <TimelineSeparator>
                <TimelineDot color="primary">
                  <Iconify icon="mdi:pencil" width={16} />
                </TimelineDot>
                {index < editHistory.length - 1 && <TimelineConnector />}
              </TimelineSeparator>

              <TimelineContent>
                <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
                  {/* Changes */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      O'zgarishlar:
                    </Typography>
                    <Stack spacing={1}>
                      {edit.changes.map((change, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            p: 1,
                            bgcolor: "grey.50",
                            borderRadius: 1,
                          }}
                        >
                          <Typography variant="body2" fontWeight="medium">
                            {formatFieldName(change.field)}:
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ${change.oldValue}
                          </Typography>
                          <Iconify icon="mdi:arrow-right" width={16} />
                          <Typography variant="body2" fontWeight="bold">
                            ${change.newValue}
                          </Typography>
                          <Chip
                            label={`${change.difference > 0 ? "+" : ""}$${change.difference.toFixed(2)}`}
                            size="small"
                            color={change.difference > 0 ? "success" : "error"}
                            sx={{ ml: "auto" }}
                          />
                        </Box>
                      ))}
                    </Stack>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Impact Summary */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
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

                  {/* Affected Payments */}
                  {edit.affectedPayments.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Ta'sirlangan to'lovlar ({edit.affectedPayments.length}):
                      </Typography>
                      <Stack direction="row" spacing={0.5} flexWrap="wrap">
                        {edit.affectedPayments.slice(0, 5).map((paymentId) => (
                          <Link
                            key={paymentId}
                            href={`#payment-${paymentId}`}
                            variant="caption"
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 0.5,
                              px: 1,
                              py: 0.5,
                              bgcolor: "primary.lighter",
                              borderRadius: 1,
                              textDecoration: "none",
                              "&:hover": {
                                bgcolor: "primary.light",
                              },
                            }}
                          >
                            <Iconify icon="mdi:receipt" width={12} />#
                            {paymentId.slice(-6)}
                          </Link>
                        ))}
                        {edit.affectedPayments.length > 5 && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ px: 1, py: 0.5 }}
                          >
                            +{edit.affectedPayments.length - 5} ta yana
                          </Typography>
                        )}
                      </Stack>
                    </Box>
                  )}
                </Paper>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </CardContent>
    </Card>
  );
};

export default EditHistoryTimeline;
