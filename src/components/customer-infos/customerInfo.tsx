import type { RootState } from "src/store";
import type { ICustomer } from "src/types/customer";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MdCancel, MdCheckCircle } from "react-icons/md";
import { type FC, useState, useEffect, useCallback } from "react";

import {
  Box,
  Chip,
  List,
  Stack,
  Avatar,
  Button,
  Divider,
  Tooltip,
  ListItem,
  TextField,
  Typography,
  IconButton,
  ListItemText,
  Autocomplete,
  CircularProgress,
} from "@mui/material";

import { useAppDispatch } from "src/hooks/useAppDispatch";

import { setModal } from "src/store/slices/modalSlice";
import { setEmployeeId } from "src/store/slices/employeeSlice";
import { getManagers } from "src/store/actions/employeeActions";
import { confirmationCustomer } from "src/store/actions/customerActions";

import { Iconify } from "../iconify";

interface IProps {
  customer: ICustomer | null;
  top?: boolean;
}

const CustomerInfo: FC<IProps> = ({ customer, top = false }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { managers, isLoading } = useSelector(
    (state: RootState) => state.employee
  );
  const currentManager = customer?.manager
    ? managers.find((manager) => manager._id === customer.manager?._id)
    : null;

  const [selectedManager, setSelectedManager] = useState<
    (typeof managers)[0] | null
  >(currentManager ?? null);

  useEffect(() => {
    dispatch(getManagers());
  }, [dispatch]);

  useEffect(() => {
    if (customer?.manager) {
      const manager = managers.find((m) => m._id === customer.manager?._id);
      setSelectedManager(manager || null);
    } else {
      setSelectedManager(null);
    }
  }, [customer, managers]);

  // const handleCustomerFocus = useCallback(() => {
  //   // if (!hasFetchedManager.current && managers.length === 0) {
  //   dispatch(getManagers());
  //   //   hasFetchedManager.current = true;
  //   // }
  // }, [dispatch]);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!customer || !selectedManager) return;

      const formJson = {
        customerId: customer._id,
        managerId: selectedManager._id,
      };

      dispatch(confirmationCustomer(formJson));
    },
    [customer, selectedManager, dispatch]
  );

  // const isFormValid = formValues.managerId;

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          gap={2}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ width: 50, height: 50 }} alt={customer?.firstName} />
            <Typography variant="h6">
              {customer?.firstName || "___"} {customer?.lastName || ""}
            </Typography>
            {customer?.isActive ? (
              <Tooltip title="Tasdiqlangan mijoz" placement="top">
                <Typography>
                  <MdCheckCircle color="green" />
                </Typography>
              </Tooltip>
            ) : (
              <Tooltip title="Hali tasdiqlanmagan" placement="top">
                <Typography>
                  <MdCancel color="red" />
                </Typography>
              </Tooltip>
            )}
          </Stack>
          <Stack
            direction="row"
            width="full"
            spacing={2}
            alignItems="center"
            sx={{ flex: 1 }}
          >
            <Autocomplete
              fullWidth
              // onFocus={handleCustomerFocus}
              options={managers}
              getOptionLabel={(option) =>
                `${option.firstName} ${option.lastName}`
              }
              isOptionEqualToValue={(option, value) => option._id === value._id}
              loading={isLoading}
              loadingText="Yuklanmoqda..."
              noOptionsText="Menejer topilmadi"
              value={selectedManager}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label="Menejer"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isLoading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              onChange={(_event, value) => {
                setSelectedManager(value);
              }}
              // sx={{ margin: "dense" }}
              sx={{ flex: 1 }}
              // ListboxProps={{
              //   style: {
              //     maxHeight: 300, // scroll chiqmasin desangiz buni olib tashlashingiz mumkin
              //   },
              // }}
            />
            <Button
              type="submit"
              color={!customer?.isActive ? "success" : "primary"}
              // disabled={!isFormValid}
              disabled={!selectedManager && customer?.isActive}
            >
              {!selectedManager ? "Tasdiqlash" : "Saqlash"}
            </Button>

            <IconButton
              aria-label="delete"
              size="small"
              onClick={() => {
                dispatch(
                  setModal({
                    modal: "customerModal",
                    data: { type: "edit", data: customer },
                  })
                );
              }}
            >
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Stack>
        </Stack>
        {!top && (
          <List dense>
            <ListItem>
              <ListItemText
                primary="Passport seriyasi"
                secondary={customer?.passportSeries || "___"}
              />
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemText
                primary="Telefon raqami"
                secondary={customer?.phoneNumber || "___"}
              />
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemText
                primary="Tug'ilgan sana"
                secondary={
                  customer?.birthDate
                    ? new Date(customer?.birthDate).toLocaleDateString()
                    : "___"
                }
              />
            </ListItem>

            <Divider component="li" />
            <ListItem>
              <ListItemText
                primary="Telegram"
                secondary={
                  customer?.telegramId ? `@${customer?.telegramId}` : "___"
                }
              />
            </ListItem>

            <Divider component="li" />
            <ListItem>
              <ListItemText
                primary="Manzil"
                secondary={customer?.address || "___"}
              />
            </ListItem>

            <Divider component="li" />
            <ListItem>
              <ListItemText
                primary="Mas'ul menejer"
                secondary={
                  <Chip
                    avatar={<Avatar src={undefined} />}
                    label={`${customer?.manager?.firstName || "___"} ${customer?.manager?.lastName || "___"}`}
                    variant="outlined"
                    sx={{ mt: 1, cursor: "pointer" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (customer?.manager?._id) {
                        dispatch(setEmployeeId(customer?.manager?._id));
                        navigate("/admin/employee");
                      }
                    }}
                  />
                }
                secondaryTypographyProps={{
                  component: "div",
                }}
              />
            </ListItem>
          </List>
        )}
      </Stack>
    </form>
  );
};

export default CustomerInfo;
