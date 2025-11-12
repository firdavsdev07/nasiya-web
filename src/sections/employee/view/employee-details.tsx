import type { RootState } from "src/store";

import { useEffect } from "react";
import { useSelector } from "react-redux";

import Grid from "@mui/material/Unstable_Grid2";
import {
  Box,
  Paper,
  Button,
  //  IconButton,
  Typography,
} from "@mui/material";

import { useAppDispatch } from "src/hooks/useAppDispatch";

// import { setModal } from "src/store/slices/modalSlice";
import { DashboardContent } from "src/layouts/dashboard";
import { setEmployeeId } from "src/store/slices/employeeSlice";
import { getEmployee } from "src/store/actions/employeeActions";

import { Iconify } from "src/components/iconify";
import Loader from "src/components/loader/Loader";
import { Balance } from "src/components/balance-card/BalannceCard";
import EmployeeInfo from "src/components/employee-infos/employeeInfo";
import { EmployeeExpensesTable } from "src/components/employee-expenses-form/EmployeeExpensesForm";
import WithdrawAllBalanceCard from "src/components/with-draw-all-balance-card/WithDrawAll-Card-Modal";

const EmployeeDetails = () => {
  const dispatch = useAppDispatch();
  const { employee, employeeId, isLoading } = useSelector(
    (state: RootState) => state.employee
  );

  useEffect(() => {
    if (employeeId) {
      dispatch(getEmployee(employeeId));
    }
  }, [employeeId, dispatch]);
  if (isLoading && employee == null) {
    return <Loader />;
  }
  if (employee == null) {
    return (
      <DashboardContent>
        <Box
          display="flex"
          alignItems="center"
          mb={5}
          justifyContent="space-between"
        >
          <Button
            color="inherit"
            startIcon={<Iconify icon="weui:back-filled" />}
            onClick={() => dispatch(setEmployeeId(null))}
          >
            Ortga
          </Button>
        </Box>
        <Typography variant="h4">No data</Typography>
      </DashboardContent>
    );
  }
  return (
    <DashboardContent>
      <Box
        display="flex"
        alignItems="center"
        mb={5}
        justifyContent="space-between"
      >
        <Button
          color="inherit"
          startIcon={<Iconify icon="weui:back-filled" />}
          onClick={() => dispatch(setEmployeeId(null))}
        >
          Ortga
        </Button>
        {/* <IconButton
          aria-label="delete"
          size="small"
          onClick={() => {
            dispatch(
              setModal({
                modal: "employeeModal",
                data: { type: "edit", data: employee },
              })
            );
          }}
        >
          <Iconify icon="solar:pen-bold" />
        </IconButton> */}
      </Box>
      <Grid container spacing={3} my={2} alignItems="stretch">
        <Grid xs={12}>
          <Balance employee={employee} />
        </Grid>

        <Grid xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, height: "100%" }}>
            <EmployeeInfo employee={employee} />
          </Paper>
        </Grid>
        <Grid xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, height: "100%" }}>
            <WithdrawAllBalanceCard employee={employee} />
          </Paper>
        </Grid>
        <Grid xs={12}>
          <EmployeeExpensesTable />
        </Grid>
      </Grid>
    </DashboardContent>
  );
};

export default EmployeeDetails;
