import "react-datepicker/dist/react-datepicker.css";

import type { RootState } from "src/store";

import DatePicker from "react-datepicker";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoCalendarOutline } from "react-icons/io5";
import { useRef, useState, useEffect, forwardRef, useCallback } from "react";

import {
  Tab,
  Box,
  Tabs,
  Card,
  Stack,
  Badge,
  Button,
  TextField,
  Typography,
  Autocomplete,
  CircularProgress,
} from "@mui/material";

import { useAppDispatch } from "src/hooks/useAppDispatch";

import { DashboardContent } from "src/layouts/dashboard";
import { setCustomerId } from "src/store/slices/customerSlice";
import { getManagers } from "src/store/actions/employeeActions";
import {
  getDebtors,
  getDebtContract,
  announceDebtors,
} from "src/store/actions/debtorActions";

import Loader from "src/components/loader/Loader";

import DebtorTable from "./debtorTable";
import { columnsDebtor, columnsContract } from "./columns";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export function DebtorView() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const dataEmployee = useSelector((state: RootState) => state.employee);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const { isLoading, debtors, debtContracts } = useSelector(
    (state: RootState) => state.debtor
  );
  const [manager, setManager] = useState<{
    firstName: string;
    lastName: string;
  } | null>(null);

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [startDate, endDate] = dateRange;

  const hasFetchedManager = useRef(false);

  useEffect(() => {
    dispatch(getDebtors());
    dispatch(getDebtContract());
  }, [dispatch]);

  useEffect(() => {
    if (startDate && endDate) {
      dispatch(getDebtContract({ startDate, endDate }));
    } else if (startDate === null && endDate === null) {
      dispatch(getDebtContract());
    }
  }, [startDate, endDate, dispatch]);

  const [tab, setTab] = useState(0);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const handleCustomerFocus = useCallback(() => {
    dispatch(getManagers());
    hasFetchedManager.current = true;
  }, [dispatch]);

  const managerFullName = manager
    ? `${manager.firstName} ${manager.lastName}`
    : null;

  const filteredDebtors = managerFullName
    ? debtors.filter((debtor) => debtor.manager === managerFullName)
    : debtors;

  const filteredContracts = managerFullName
    ? debtContracts.filter((contract) => contract.manager === managerFullName)
    : debtContracts;

  // Debug logs
  // console.log("managerId", manager);
  // console.log("contractId", selectedRows);

  const ManagerFilter = (
    <Autocomplete
      onFocus={handleCustomerFocus}
      options={dataEmployee.managers}
      getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
      isOptionEqualToValue={(option, value) =>
        `${option.firstName} ${option.lastName}` ===
        `${value.firstName} ${value.lastName}`
      }
      loading={dataEmployee.isLoading}
      loadingText="Yuklanmoqda..."
      noOptionsText="Menejerlar topilmadi"
      renderInput={(params) => (
        <TextField
          {...params}
          size="small"
          label="Menejer bo'yicha filter"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {dataEmployee.isLoading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      onChange={(_event, value) => {
        setManager(value);
      }}
      value={manager}
      sx={{ minWidth: 200, width: "100%" }}
    />
  );

  const calendar = (
    <DatePicker
      selectsRange
      startDate={startDate}
      endDate={endDate}
      onChange={(update) => setDateRange(update)}
      customInput={<CustomDateInput />}
      isClearable
      popperPlacement="bottom-end"
      portalId="root-portal"
    />
  );

  if (debtors.length === 0 && isLoading) {
    return <Loader />;
  }

  return (
    <DashboardContent>
      <Stack spacing={1}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tab}
            onChange={handleChangeTab}
            aria-label="basic tabs example"
          >
            <Tab
              label={
                <Box sx={{ textAlign: "left" }}>
                  <Typography variant="h6" fontWeight="bold">
                    Qarzdorlar
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    Mijozlar bo'yicha guruhlangan
                  </Typography>
                </Box>
              }
              {...a11yProps(0)}
            />
            <Tab
              label={
                <Badge
                  color="error"
                  badgeContent={debtContracts.length}
                  sx={{
                    "& .MuiBadge-badge": {
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                    },
                  }}
                >
                  <Box sx={{ textAlign: "left", pr: 2 }}>
                    <Typography variant="h6" fontWeight="bold">
                      Qarzdorliklar
                    </Typography>
                    <Typography
                      variant="caption"
                      color="error.main"
                      display="block"
                    >
                      Muddati o'tgan shartnomalar
                    </Typography>
                  </Box>
                </Badge>
              }
              {...a11yProps(1)}
            />
          </Tabs>
        </Box>
        <CustomTabPanel value={tab} index={0}>
          <DebtorTable
            data={filteredDebtors}
            columns={columnsDebtor}
            component={ManagerFilter}
            onRowClick={(row) => {
              dispatch(setCustomerId(row._id));
              navigate("/admin/user");
            }}
          />
        </CustomTabPanel>
        <CustomTabPanel value={tab} index={1}>
          {/* Statistika */}
          <Card sx={{ p: 2, mb: 2, bgcolor: "error.lighter" }}>
            <Stack direction="row" spacing={3} alignItems="center">
              <Box>
                <Typography variant="h4" color="error.main" fontWeight="bold">
                  {debtContracts.length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Muddati o'tgan shartnomalar
                </Typography>
              </Box>
              <Box sx={{ borderLeft: 1, borderColor: "divider", pl: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Faqat to'lov muddati o'tgan shartnomalar ko'rsatiladi
                </Typography>
              </Box>
            </Stack>
          </Card>

          {selectedRows.length > 0 && (
            <Card sx={{ p: 1, mb: 1 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography>{selectedRows.length} ta tanlandi</Typography>
                <Button
                  variant="outlined"
                  onClick={() => {
                    dispatch(announceDebtors(selectedRows));
                    setSelectedRows([]);
                  }}
                  disabled={Boolean(startDate && endDate)}
                >
                  Qarzdorlarni e'lon qilish
                </Button>
              </Stack>
            </Card>
          )}
          <DebtorTable
            data={filteredContracts}
            columns={columnsContract}
            component={ManagerFilter}
            onRowClick={() => {}}
            selectable
            setSelectedRows={setSelectedRows}
            selectedRows={selectedRows}
            calendar={calendar}
          />
        </CustomTabPanel>
      </Stack>
    </DashboardContent>
  );
}

const CustomDateInput = forwardRef<
  HTMLButtonElement,
  {
    value?: string;
    onClick?: () => void;
  }
>(({ value, onClick }, ref) => (
  <Button
    ref={ref}
    onClick={onClick}
    variant="text"
    color="inherit"
    startIcon={<IoCalendarOutline />}
    sx={{
      width: "70px",
    }}
  />
));
