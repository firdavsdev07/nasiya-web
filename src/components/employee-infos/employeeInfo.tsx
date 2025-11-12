import type { FC } from "react";
import type { IEmployee } from "src/types/employee";

import {
  Box,
  List,
  Stack,
  Avatar,
  Divider,
  ListItem,
  IconButton,
  Typography,
  ListItemText,
} from "@mui/material";

import { useAppDispatch } from "src/hooks/useAppDispatch";

import { formatUzbekPhoneNumber } from "src/utils/format-number";

import { setModal } from "src/store/slices/modalSlice";

import { Iconify } from "../iconify";

interface IProps {
  employee: IEmployee;
}

const EmployeeInfo: FC<IProps> = ({ employee }) => {
  const dispatch = useAppDispatch();

  return (
    <Box>
      <Stack spacing={3}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ width: 50, height: 50 }} alt={employee.firstName} />
            <Typography variant="h6">{`${employee.firstName} ${employee.lastName}`}</Typography>
          </Stack>
          <IconButton
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
          </IconButton>
        </Stack>
        <List dense>
          <Divider component="li" />
          <ListItem>
            <ListItemText
              primary="Telefon raqami"
              secondary={formatUzbekPhoneNumber(employee.phoneNumber)}
            />
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemText primary="Rol" secondary={employee.role} />
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemText
              primary="Telegram"
              secondary={employee.telegramId ? employee.telegramId : "___"}
            />
          </ListItem>
        </List>
      </Stack>
    </Box>
  );
};

export default EmployeeInfo;
