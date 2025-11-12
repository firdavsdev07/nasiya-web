import React from "react";

import { Box, Menu, MenuItem, Typography } from "@mui/material";

import type { Column, SortConfig } from "./types";

interface TableSortProps<T> {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  columns: Column<T>[];
  sortConfig: SortConfig<T> | null;
  onSort: (key: string) => void;
}

export function TableSort<T>({
  anchorEl,
  onClose,
  columns,
  sortConfig,
  onSort,
}: TableSortProps<T>) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Saralash
        </Typography>
        {columns
          .filter((column) => column.sortable)
          .map((column) => (
            <MenuItem
              key={column.id}
              onClick={() => {
                onSort(column.id);
                onClose();
              }}
              selected={sortConfig?.key === column.id}
            >
              {column.label}{" "}
              {sortConfig?.key === column.id &&
                (sortConfig.direction === "asc" ? "↑" : "↓")}
            </MenuItem>
          ))}
      </Box>
    </Menu>
  );
}
