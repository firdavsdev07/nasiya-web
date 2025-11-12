/* eslint-disable react/prop-types */
import type { RootState } from "src/store";
// import type { ApexOptions } from "apexcharts";
import type { IEmployee } from "src/types/employee";
import type { Column } from "src/components/table/types";

import { useEffect } from "react";
import { useSelector } from "react-redux";
// import ReactApexChart from "react-apexcharts";

import { Box, Stack, Button, Typography } from "@mui/material";

import { useTableLogic } from "src/hooks/useTableLogic";
import { useAppDispatch } from "src/hooks/useAppDispatch";

import { setModal } from "src/store/slices/modalSlice";
import { DashboardContent } from "src/layouts/dashboard";
import { getEmployees } from "src/store/actions/employeeActions";
// import { setEmployeeId } from "src/store/slices/employeeSlice";

import { setEmployeeId } from "src/store/slices/employeeSlice";

import { Iconify } from "src/components/iconify";
import Loader from "src/components/loader/Loader";
import { GenericTable } from "src/components/table/GnericTable";

import ActionEmployee from "../action/action-meneger";

const columns: Column[] = [
  { id: "firstName", label: "Ism", sortable: true },
  { id: "lastName", label: "Familiya", sortable: true },
  { id: "phoneNumber", label: "Telefon raqami", sortable: true },
  { id: "role", label: "Role", sortable: true },
];

export function EmployeesView() {
  const dispatch = useAppDispatch();
  const { employees, isLoading } = useSelector(
    (state: RootState) => state.employee
  );
  const logic = useTableLogic<IEmployee>(employees, columns);

  useEffect(() => {
    dispatch(getEmployees());
  }, [dispatch]);

  if (employees.length === 0 && isLoading) {
    return <Loader />;
  }
  return (
    <DashboardContent>
      <Stack spacing={5}>
        <Box display="flex" alignItems="center">
          <Typography variant="h4" flexGrow={1}>
            Xodimlar
          </Typography>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => {
              dispatch(
                setModal({
                  modal: "employeeModal",
                  data: { type: "add", data: undefined },
                })
              );
            }}
          >
            Qo&apos;shish
          </Button>
        </Box>

        {/* <Grid container spacing={1}>
          <Grid xs={12} md={6}>
            <Card sx={{ p: 1 }}>
              <Typography variant="h6" mb={2}>
                Menejerlarning qarzdorlik ko`rsatgichi
              </Typography>
              <ApexChart
                series={[{ name: "qarzi", data: kpiValues }]}
                categories={menegerNames}
                type
              />
            </Card>
          </Grid>
          <Grid xs={12} md={6}>
            <Card sx={{ p: 1 }}>
              <Typography variant="h6" mb={2}>
                Mijozlar soni bo‘yicha statistika
              </Typography>
              <ApexChart
                series={[{ name: "soni", data: clientsData }]}
                categories={menegerNames}
                type={false}
              />
            </Card>
          </Grid>
        </Grid> */}

        {/* <Card>
          <TableToolbar
            onFilterClick={(e) => setFilterAnchorEl(e.currentTarget)}
            onSortClick={(e) => setSortAnchorEl(e.currentTarget)}
            onColumnClick={(e) => setColumnAnchorEl(e.currentTarget)}
            searchText={searchText}
            onSearchChange={setSearchText}
          />
          <TableComponent
            columns={columns}
            data={filteredData}
            selectedColumns={selectedColumns}
            onRowClick={(row) => dispatch(setEmployeeData(row))}
            renderActions={(row) => (
              <ActionEmployee employee={row as IEmployee} />
            )}
          />
        </Card> */}
        <GenericTable
          data={employees}
          columns={columns}
          logic={logic}
          onRowClick={(row) => dispatch(setEmployeeId(row._id))}
          renderActions={(row) => <ActionEmployee employee={row} />}
        />
      </Stack>
    </DashboardContent>
  );
}

// interface ApexChartProps {
//   // series: {name:string,data:number[]};
//   series: { name: string; data: number[] }[];
//   categories: string[];
//   type: boolean;
// }

// const ApexChart: React.FC<ApexChartProps> = ({ series, categories, type }) => {
//   const options: ApexOptions = {
//     chart: {
//       type: `bar`,
//       height: 350,
//     },
//     plotOptions: {
//       bar: {
//         borderRadius: 4,
//         horizontal: type,
//       },
//     },
//     dataLabels: {
//       enabled: false,
//     },
//     xaxis: {
//       categories,
//     },
//   };

//   return (
//     <div id="chart">
//       <ReactApexChart
//         options={options}
//         series={series}
//         type="bar"
//         height={350}
//       />
//     </div>
//   );
// };

// export const menegersData: TableData[] = [
//   {
//     _id: "m1",
//     name: "Ali",
//     surname: "Karimov",
//     phoneNumber: "+998901234567",
//     telegramId: "tg_ali",
//     clientCount: 15,
//     totalDebt: 12000000,
//     kpi: 5,
//   },
//   {
//     _id: "m2",
//     name: "Aziz",
//     surname: "Turgunov",
//     phoneNumber: "+998901234568",
//     telegramId: "tg_aziz",
//     clientCount: 20,
//     totalDebt: 15000000,
//     kpi: 0,
//   },
//   {
//     _id: "m3",
//     name: "Olim",
//     surname: "Xasanov",
//     phoneNumber: "+998901234569",
//     telegramId: "tg_olim",
//     clientCount: 12,
//     totalDebt: 9000000,
//     kpi: 0,
//   },
//   {
//     _id: "m4",
//     name: "Madina",
//     surname: "Ismoilova",
//     phoneNumber: "+998901234570",
//     telegramId: "tg_madina",
//     clientCount: 25,
//     totalDebt: 18000000,
//     kpi: 2,
//   },
//   {
//     _id: "m5",
//     name: "Jasur",
//     surname: "To‘xtayev",
//     phoneNumber: "+998901234571",
//     telegramId: "tg_jasur",
//     clientCount: 18,
//     totalDebt: 11000000,
//     kpi: 7,
//   },
//   {
//     _id: "m6",
//     name: "Nodir",
//     surname: "Sobirov",
//     phoneNumber: "+998901234572",
//     telegramId: "tg_nodir",
//     clientCount: 30,
//     totalDebt: 25000000,
//     kpi: 5,
//   },
//   {
//     _id: "m7",
//     name: "Sanjar",
//     surname: "Yoqubov",
//     phoneNumber: "+998901234573",
//     telegramId: "tg_sanjar",
//     clientCount: 22,
//     totalDebt: 14000000,
//     kpi: 8,
//   },
// ];
