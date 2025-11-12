import {
  Box,
  Popover,
  Checkbox,
  Typography,
  FormControlLabel,
} from "@mui/material";

import type { Column } from "./types";

interface TableColumnSelectorProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  columns: Column[];
  selectedColumns: string[];
  onColumnToggle: (columnId: string) => void;
}

export function TableColumnSelector({
  anchorEl,
  onClose,
  columns,
  selectedColumns,
  onColumnToggle,
}: TableColumnSelectorProps) {
  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
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
          Ustunlarni tanlang
        </Typography>
        {columns.map((column) => (
          <div key={column.id}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedColumns.includes(column.id)}
                  onChange={() => onColumnToggle(column.id)}
                />
              }
              label={column.label}
            />
          </div>
        ))}
      </Box>
    </Popover>
  );
}
