import React, { useState, useEffect } from "react";
import { Box, Card, CardHeader, CardContent, Typography } from "@mui/material";
import { ContractEditAlert } from "src/components/contract-edit-alert";
import { Iconify } from "src/components/iconify";
import { useNavigate } from "react-router-dom";

interface ContractEditNotification {
  _id: string;
  contractId: string;
  contractNumber: string;
  customerName: string;
  editedBy: string;
  editDate: string;
  changes: Array<{
    field: string;
    oldValue: number;
    newValue: number;
  }>;
  impactSummary: {
    underpaidCount: number;
    overpaidCount: number;
    additionalPaymentsCreated: number;
  };
}

interface DashboardAlertsProps {
  notifications?: ContractEditNotification[];
  maxDisplay?: number;
}

const DashboardAlerts: React.FC<DashboardAlertsProps> = ({
  notifications = [],
  maxDisplay = 5,
}) => {
  const navigate = useNavigate();
  const [visibleNotifications, setVisibleNotifications] = useState<
    ContractEditNotification[]
  >([]);

  useEffect(() => {
    setVisibleNotifications(notifications.slice(0, maxDisplay));
  }, [notifications, maxDisplay]);

  const handleViewContract = (contractId: string) => {
    navigate(`/contract/${contractId}`);
  };

  const handleViewPayments = (contractId: string) => {
    navigate(`/contract/${contractId}#payments`);
  };

  const handleDismiss = (notificationId: string) => {
    setVisibleNotifications((prev) =>
      prev.filter((n) => n._id !== notificationId)
    );
    // TODO: Call API to mark notification as read
  };

  if (visibleNotifications.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader
        title="So'nggi Yangiliklar"
        avatar={<Iconify icon="mdi:bell" width={24} />}
        subheader={`${visibleNotifications.length} ta yangilik`}
      />
      <CardContent>
        {visibleNotifications.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 4,
            }}
          >
            <Iconify
              icon="mdi:bell-off"
              width={48}
              sx={{ color: "text.disabled", mb: 2 }}
            />
            <Typography variant="body2" color="text.secondary">
              Yangiliklar yo'q
            </Typography>
          </Box>
        ) : (
          <Box>
            {visibleNotifications.map((notification) => (
              <ContractEditAlert
                key={notification._id}
                notification={notification}
                onViewContract={handleViewContract}
                onViewPayments={handleViewPayments}
                onDismiss={handleDismiss}
              />
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardAlerts;
