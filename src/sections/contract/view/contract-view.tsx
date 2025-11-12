import type { RootState } from "src/store";

import { useSelector } from "react-redux";
import { RiUploadCloud2Fill } from "react-icons/ri";
import React, { useRef, useState, useEffect } from "react";

import {
  Box,
  Tab,
  Tabs,
  Badge,
  Stack,
  Button,
  Tooltip,
  Typography,
} from "@mui/material";

import { useAppDispatch } from "src/hooks/useAppDispatch";

import { setModal } from "src/store/slices/modalSlice";
import { DashboardContent } from "src/layouts/dashboard";
import { setCustomer } from "src/store/slices/customerSlice";
import { setContractId } from "src/store/slices/contractSlice";
import {
  getContract,
  getContracts,
  getNewContracts,
  getCompletedContracts,
  approveContract,
} from "src/store/actions/contractActions";

import { Iconify } from "src/components/iconify";
import Loader from "src/components/loader/Loader";

import ContractTable from "./contactTable";
import ActionContract from "../action/action-contract";
import { columnsPageContract, columnsPageNewContract } from "./column";

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

export function ContractsView() {
  const dispatch = useAppDispatch();

  const { contracts, newContracts, completedContracts, isLoading } =
    useSelector((state: RootState) => state.contract);

  const [tab, setTab] = useState(0);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    dispatch(getContracts());
    dispatch(getNewContracts());
  }, [dispatch]);

  useEffect(() => {
    if (tab === 2) {
      dispatch(getCompletedContracts());
    }
  }, [tab, dispatch]);

  // Debug: nextPaymentDate validation
  // useEffect(() => {
  //   const allContracts = [...contracts, ...newContracts, ...completedContracts];
  //   const invalidNextPaymentContracts = allContracts.filter((contract) => {
  //     const date = contract.nextPaymentDate;
  //     if (!date) return true;
  //     const parsedDate = new Date(date);
  //     return Number.isNaN(parsedDate.getTime());
  //   });
  //   if (invalidNextPaymentContracts.length > 0) {
  //     console.log("❌ Invalid nextPaymentDate contracts:", invalidNextPaymentContracts);
  //   }
  // }, [contracts, newContracts, completedContracts]);

  if (contracts.length === 0 && isLoading) {
    return <Loader />;
  }

  return (
    <DashboardContent>
      <Stack spacing={1}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="end"
          gap={3}
          mb={2}
        >
          {/* <Tooltip title="Import from Excel">
            <Button
              variant="contained"
              color="primary"
              startIcon={<RiUploadCloud2Fill />}
              onClick={handleImportClick}
              sx={{ ml: 2 }}
            >
              Import
            </Button>
          </Tooltip> */}
          <input
            type="file"
            ref={fileInputRef}
            // onChange={handleFileUpload}
            accept=".xlsx, .xls, .csv"
            style={{ display: "none" }}
          />
          <Tooltip title="Shartnoma qo'shish">
            <Button
              variant="contained"
              color="inherit"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => {
                dispatch(setCustomer(null));
                dispatch(
                  setModal({
                    modal: "contractModal",
                    data: { type: "add", data: undefined },
                  })
                );
              }}
            >
              Qo&apos;shish
            </Button>
          </Tooltip>
        </Box>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tab}
            onChange={handleChangeTab}
            aria-label="basic tabs example"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab
              label={
                <Typography variant="h6" flexGrow={1}>
                  Faol shartnomalar
                </Typography>
              }
              {...a11yProps(0)}
            />
            <Tab
              label={
                <Badge color="error" badgeContent={newContracts.length}>
                  <Typography variant="h6" flexGrow={1}>
                    Yangi shartnomalar
                  </Typography>
                </Badge>
              }
              {...a11yProps(1)}
            />
            <Tab
              label={
                <Typography variant="h6" flexGrow={1}>
                  Tugatilgan
                </Typography>
              }
              {...a11yProps(1)}
            />
          </Tabs>
        </Box>
        <CustomTabPanel value={tab} index={0}>
          <ContractTable
            data={contracts}
            columns={columnsPageContract}
            onRowClick={(row) => {
              dispatch(getContract(row._id));
              dispatch(setContractId(row._id));
            }}
            renderActions={(contract) => <ActionContract contract={contract} />}
          />

          {/* <TableStats
              data={filteredData}
              lastMonthData={lastMonthData}
              calculateTotal={calculateTotal}
            /> */}
          {/* <Card>
              <TableComponent
                columns={columns}
                data={filteredData}
                selectedColumns={selectedColumns}
                onRowClick={(row) => setModalOpen(true)}
                renderActions={(row) => (
                  <ActionContract contract={row as IContract} />
                )}
              />
            </Card> */}
        </CustomTabPanel>
        <CustomTabPanel value={tab} index={1}>
          <ContractTable
            data={newContracts}
            columns={columnsPageNewContract}
            onRowClick={(row) => {
              console.log("ll", row);

              dispatch(
                setModal({
                  modal: "contractModal",
                  data: { type: "edit", data: row },
                })
              );
            }}
            renderActions={(row) => (
              <Button
                variant="contained"
                color="success"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm("Shartnomani tasdiqlaysizmi?")) {
                    dispatch(approveContract(row._id));
                  }
                }}
              >
                Tasdiqlash
              </Button>
            )}
          />

          {/* <TableComponent
            columns={columns}
            data={filteredData}
            selectedColumns={selectedColumns}
            onRowClick={(row) => setCModalOpen(true)}
            // renderActions={(row) => (
            //   <ActionContract contract={row as IContract} />
            // )}
          /> */}
        </CustomTabPanel>

        <CustomTabPanel value={tab} index={2}>
          {completedContracts.length === 0 ? (
            <Box width="100%" height="100px" display="flex" alignItems="center">
              <Loader />
            </Box>
          ) : (
            <ContractTable
              data={completedContracts}
              columns={columnsPageContract}
              onRowClick={(row) => {
                dispatch(getContract(row._id));
                dispatch(setContractId(row._id));
              }}
            />

            // <ContractTable
            //   data={completedContracts}
            //   columns={columnsPageContract}
            //   onRowClick={(row) => {
            //     console.log("ll", row);

            //     dispatch(
            //       setModal({
            //         modal: "contractModal",
            //         data: { type: "edit", data: row },
            //       })
            //     );
            //   }}
            // />
          )}

          {/* <TableComponent
            columns={columns}
            data={filteredData}
            selectedColumns={selectedColumns}
            onRowClick={(row) => setCModalOpen(true)}
            // renderActions={(row) => (
            //   <ActionContract contract={row as IContract} />
            // )}
          /> */}
        </CustomTabPanel>
      </Stack>
    </DashboardContent>
  );
}
