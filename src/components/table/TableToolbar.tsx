import { MdSort, MdSearch, MdFilterList, MdViewColumn } from "react-icons/md";

import Grid from "@mui/material/Unstable_Grid2";
import { Box, Stack, Button, TextField, InputAdornment } from "@mui/material";

interface TableToolbarProps {
  onFilterClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onSortClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onColumnClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  searchText: string;
  onSearchChange: (text: string) => void;
  component?: React.ReactNode;
  calendar?: React.ReactNode;
  uploadData?: React.ReactNode;
}

export function TableToolbar({
  onFilterClick,
  onSortClick,
  onColumnClick,
  searchText,
  onSearchChange,
  component,
  calendar,
  uploadData,
}: TableToolbarProps) {
  return (
    <Box
      display="flex"
      alignItems="center"
      p={1}
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        backgroundColor: "white",
        borderBottom: "1px solid #eee",
      }}
    >
      <Grid container spacing={1} width={1}>
        <Grid xs={12} sm={6} md={component ? 3 : 6}>
          <TextField
            placeholder="Qidirish..."
            size="small"
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            sx={{ mr: 2, width: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MdSearch />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        {component && (
          <Grid xs={12} sm={6} md={4} display="flex" justifyContent="end">
            {component}
          </Grid>
        )}
        {/* {calendar && (
          <Grid xs={12} sm={6} md={3} justifyItems="right">
            {calendar}
          </Grid>
        )} */}
        <Grid xs={12} md={component ? 5 : 6} justifyItems="right">
          <Stack
            width={1}
            direction={{ xs: "column", sm: "row" }}
            justifyContent="end"
            spacing={1}
          >
            {/* {calendar && (
              <Box display="flex" justifyContent="end">
                {calendar}
              </Box>
            )} */}
            <Stack direction="row" spacing={1} justifyContent="end">
              <Button
                variant="text"
                color="inherit"
                startIcon={<MdFilterList />}
                onClick={onFilterClick}
              >
                Filter
              </Button>
              <Button
                variant="text"
                color="inherit"
                startIcon={<MdSort />}
                onClick={onSortClick}
              >
                Saralash
              </Button>
              <Button
                variant="text"
                color="inherit"
                startIcon={<MdViewColumn />}
                onClick={onColumnClick}
              >
                Ustunlar
              </Button>
              {calendar && <Box sx={{ overflow: "hidden" }}>{calendar}</Box>}
              {/* {uploadData && uploadData} */}
            </Stack>
            {uploadData && uploadData}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
