import type { RootState } from "src/store";

import { useSelector } from "react-redux";
import { RiUploadCloud2Fill } from "react-icons/ri";
import { memo, useRef, useState, useEffect } from "react";
import { enqueueSnackbar } from "notistack";

import {
  Box,
  Tab,
  Tabs,
  Stack,
  Badge,
  Button,
  Tooltip,
  Typography,
  CircularProgress,
} from "@mui/material";

import { useAppDispatch } from "src/hooks/useAppDispatch";

import authApi from "src/server/auth";
import { setModal } from "src/store/slices/modalSlice";
import { DashboardContent } from "src/layouts/dashboard";
import { setCustomerId } from "src/store/slices/customerSlice";
import {
  getCustomers,
  getNewCustomers,
} from "src/store/actions/customerActions";

import { Iconify } from "src/components/iconify";
import Loader from "src/components/loader/Loader";

import CustomerTable from "./customerTable";
import { columnsPageCustomers, columnsNewPageCustomers } from "./columns";

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

const CustomerView = () => {
  const dispatch = useAppDispatch();

  const { customers, newCustomers, isLoading } = useSelector(
    (state: RootState) => state.customer
  );

  useEffect(() => {
    dispatch(getCustomers());
    dispatch(getNewCustomers());
  }, [dispatch]);

  const [tab, setTab] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Fayl formatini tekshirish
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];

    if (!validTypes.includes(file.type)) {
      enqueueSnackbar("Faqat Excel fayllar (.xlsx, .xls) qabul qilinadi", {
        variant: "error",
      });
      return;
    }

    // Fayl hajmini tekshirish (10MB)
    if (file.size > 10 * 1024 * 1024) {
      enqueueSnackbar("Fayl hajmi 10MB dan oshmasligi kerak", {
        variant: "error",
      });
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await authApi.post("/excel/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        enqueueSnackbar(response.data.message, {
          variant: "success",
        });

        // Statistikani ko'rsatish
        const { stats } = response.data;
        enqueueSnackbar(
          `Yaratildi: ${stats.contractsCreated} ta shartnoma, ${stats.customersCreated} ta yangi mijoz`,
          {
            variant: "info",
          }
        );

        // Mijozlar ro'yxatini yangilash
        dispatch(getCustomers());
        dispatch(getNewCustomers());
      } else {
        enqueueSnackbar(response.data.message, {
          variant: "warning",
        });

        // Xatoliklarni ko'rsatish
        if (response.data.errors && response.data.errors.length > 0) {
          response.data.errors.slice(0, 3).forEach((error: any) => {
            enqueueSnackbar(
              `Qator ${error.row} (${error.customer}): ${error.error}`,
              {
                variant: "error",
              }
            );
          });
        }
      }
    } catch (error: any) {
      console.error("Excel import error:", error);
      enqueueSnackbar(
        error.response?.data?.message ||
          "Excel import qilishda xatolik yuz berdi",
        {
          variant: "error",
        }
      );
    } finally {
      setUploading(false);
      // Input'ni tozalash (bir xil faylni qayta yuklash uchun)
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  if (customers.length === 0 && isLoading) {
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
          <Tooltip title="Exceldan import qilish">
            <Button
              variant="contained"
              color="primary"
              startIcon={
                uploading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <RiUploadCloud2Fill />
                )
              }
              onClick={handleImportClick}
              disabled={uploading}
              sx={{ ml: 2 }}
            >
              {uploading ? "Yuklanmoqda..." : "Import"}
            </Button>
          </Tooltip>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".xlsx, .xls"
            style={{ display: "none" }}
          />

          <Tooltip title="Mijoz qo'shish">
            <Button
              variant="contained"
              color="inherit"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => {
                dispatch(
                  setModal({
                    modal: "customerModal",
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
          >
            <Tab
              label={
                <Typography variant="h6" flexGrow={1}>
                  Mijozlar
                </Typography>
              }
              {...a11yProps(0)}
            />
            <Tab
              label={
                <Badge color="error" badgeContent={newCustomers.length}>
                  <Typography variant="h6" flexGrow={1}>
                    Yangi mijozlar
                  </Typography>
                </Badge>
              }
              {...a11yProps(1)}
            />
          </Tabs>
        </Box>

        <CustomTabPanel value={tab} index={0}>
          <CustomerTable
            data={customers}
            columns={columnsPageCustomers}
            onRowClick={(row) => {
              dispatch(setCustomerId(row._id));
            }}
          />
        </CustomTabPanel>

        <CustomTabPanel value={tab} index={1}>
          <CustomerTable
            data={newCustomers}
            columns={columnsNewPageCustomers}
            onRowClick={(row) => {
              dispatch(setCustomerId(row._id));
            }}
          />
        </CustomTabPanel>
      </Stack>
    </DashboardContent>
  );
};

export default memo(CustomerView);
