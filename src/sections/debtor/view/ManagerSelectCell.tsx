import type { RootState } from "src/store";
import type { SelectChangeEvent } from "@mui/material";

import React from "react";
import { useSelector } from "react-redux";

import { Select, MenuItem } from "@mui/material";

interface ManagerSelectCellProps {
  row: any;
  value: string;
  onManagerChange: (customerId: string, newManager: string) => void;
}

export const ManagerSelectCellDebtor = React.memo(
  ({ row, value, onManagerChange }: ManagerSelectCellProps) => {
    const { managers } = useSelector((state: RootState) => state.employee);

    const selectedManagerId =
      managers.find(
        (m) => `${m.firstName} ${m.lastName}`.trim() === row.manager.trim()
      )?._id || "";

    const handleChange = (event: SelectChangeEvent<string>) => {
      const newManager = event.target.value as string;
      onManagerChange(row._id, newManager);
    };
    return (
      <Select
        value={selectedManagerId}
        onChange={handleChange}
        displayEmpty
        size="small"
        sx={{ minWidth: "100px", width: "100%" }}
        onClick={(e) => e.stopPropagation()}
        // sx={{ width: "100%" }}
      >
        {managers.map((manager) => (
          <MenuItem key={manager._id} value={manager._id}>
            {`${manager.firstName} ${manager.lastName}`}
          </MenuItem>
        ))}
      </Select>
    );
  }
);
