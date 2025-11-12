/* eslint-disable @typescript-eslint/no-shadow */
import type { RootState, AppDispatch } from "src/store";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Chip,
  Paper,
  Table,
  Stack,
  TableRow,
  Skeleton,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableFooter,
  TableContainer,
  TablePagination,
} from "@mui/material";

import { getExpenses } from "src/store/actions/employeeActions";

import ActionExpense from "src/sections/employee/action/action-expense";

export const EmployeeExpensesTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { expenses, expensesMeta, isLoadingExpenses, employeeId } = useSelector(
    (state: RootState) => state.employee
  );

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);

  // Debug: Log state changes
  useEffect(() => {
    console.log("📊 Expenses state updated:", {
      expenses: expenses?.length || 0,
      expensesMeta,
      isLoadingExpenses,
      employeeId,
    });
  }, [expenses, expensesMeta, isLoadingExpenses, employeeId]);

  useEffect(() => {
    if (employeeId) {
      console.log("📊 Fetching expenses for employee:", {
        employeeId,
        page: page + 1,
        limit,
      });
      dispatch(getExpenses(employeeId, page + 1, limit));
    }
  }, [dispatch, employeeId, page, limit]);

  const renderSkeletonRows = (count = 10, columns = 6) =>
    Array.from({ length: count }).map((_, i) => (
      <TableRow key={i}>
        {Array.from({ length: columns }).map((_, j) => (
          <TableCell key={j}>
            <Skeleton variant="text" height={28} />
          </TableCell>
        ))}
      </TableRow>
    ));

  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" p={2}>
        Xodimlar xarajatlari
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Miqdorlar</TableCell>
            <TableCell>Sana</TableCell>
            <TableCell>Holat</TableCell>
            <TableCell>Izoh</TableCell>
            <TableCell align="right">Amal</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoadingExpenses
            ? renderSkeletonRows(10, 6)
            : expenses?.map((exp) => (
                <TableRow key={exp._id}>
                  <TableCell>
                    <Stack spacing={0.5}>
                      {Object.entries(exp.currencyDetails).map(([key, val]) => (
                        <Typography key={key} variant="body2">
                          {key.toUpperCase()}: {val}
                        </Typography>
                      ))}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    {new Date(exp.createdAt).toLocaleDateString("uz-UZ")}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={exp.isActive ? "Ochiq" : "Yopilgan"}
                      color={exp.isActive ? "warning" : "success"}
                    />
                  </TableCell>
                  <TableCell>{exp.notes}</TableCell>

                  <TableCell align="right">
                    {employeeId && exp.isActive && (
                      <ActionExpense
                        id={exp._id}
                        employeeId={employeeId}
                        page={page}
                        limit={limit}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              count={expensesMeta?.total || 0}
              page={page}
              rowsPerPage={limit}
              onPageChange={(_, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => {
                setLimit(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 20]}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};
