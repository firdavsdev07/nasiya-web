import React, { useState, useEffect } from "react";

import {
  Table,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TablePagination,
} from "@mui/material";

import { Scrollbar } from "../scrollbar";
import { TableNoData } from "./TableNoData";

interface Column<T = any> {
  id: string;
  label: string;
  minWidth?: number;
  align?: "right" | "left" | "center";
  format?: (value: T) => string | React.ReactNode;
  renderCell?: (row: T) => React.ReactNode;
  sticky?: "left" | "right";
  stickyOffset?: number;
}

interface TableComponentProps<T> {
  // columns: Column[];
  // data: T[];
  // selectedColumns?: string[];
  // rowsPerPageOptions?: number[];
  // initialRowsPerPage?: number;
  // onRowClick?: (row: T) => void;
  // noDataText?: string;
  // renderActions?: (row: T) => React.ReactNode;
  columns: Column[];
  data: T[];
  selectedColumns?: string[];
  rowsPerPageOptions?: number[];
  initialRowsPerPage?: number;
  onRowClick?: (row: T) => void;
  filterName?: string;
  noDataText?: string;
  renderActions?: (row: T) => React.ReactNode;
  selectable?: boolean;
  onSelectedRowsChange?: (selectedIds: string[]) => void; // Yangi prop
  selectedRowss?: string[];
}

export function TableComponent<T extends Record<string, any>>({
  // columns,
  // data,

  // selectedColumns = columns.map((col) => col.id),
  // rowsPerPageOptions = [5, 10, 25],
  // initialRowsPerPage = 10,
  // onRowClick,
  // noDataText = "No data found",
  // renderActions,
  columns,
  data,
  selectedColumns = columns.map((col) => col.id),
  rowsPerPageOptions = [15, 50, 100, 1000],
  initialRowsPerPage = 100,
  onRowClick,
  filterName = "",
  noDataText = "No data found",
  renderActions,
  selectable = false,
  onSelectedRowsChange, // Yangi prop
  selectedRowss,
}: TableComponentProps<T>) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  // const [filterName] = useState("");

  // Barcha qatorlarni tanlash/olib tashlash
  const handleSelectAllRows = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = filteredData.map((row) => row._id || row.id);
      setSelectedRows(newSelected);
      onSelectedRowsChange?.(newSelected);
    } else {
      setSelectedRows([]);
      onSelectedRowsChange?.([]);
    }
  };

  // Alohida qatorni tanlash/olib tashlash
  const handleSelectRow = (event: React.MouseEvent, id: string) => {
    event.stopPropagation();
    const selectedIndex = selectedRows.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = [...selectedRows, id];
    } else {
      newSelected = selectedRows.filter((rowId) => rowId !== id);
    }

    setSelectedRows(newSelected);
    onSelectedRowsChange?.(newSelected);
  };

  useEffect(() => {
    if (selectedRowss?.length === 0) {
      setSelectedRows([]);
    }
  }, [selectedRowss]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredData = data.filter((item) =>
    Object.values(item).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(filterName.toLowerCase())
    )
  );

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredData.length) : 0;

  const notFound = !filteredData.length && !!filterName;
  const isEmpty = !filteredData.length && !filterName;

  // const renderCellValue = (row: T, column: Column) => {
  //   const value = row[column.id];
  //   return column.format
  //     ? column.format(value)
  //     : column.id === "birthDate"
  //       ? value.split("T")[0]
  //       : value;
  // };
  const renderCellValue = (row: T, column: Column) => {
    if (column.renderCell) {
      return column.renderCell(row);
    }

    const value = row[column.id];

    if (column.id === "manager") {
      return value || "—";
    }

    return column.format
      ? column.format(value)
      : column.id === "birthDate"
        ? value.split("T")[0]
        : value;
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // Tanlangan qatorlarni tozalash
        setSelectedRows([]);
        onSelectedRowsChange?.([]);

        // Agar boshqa selectlar ham bo‘lsa (menejer, dateRange), ularni ham reset qilish mumkin:
        // setManager(null);
        // setDateRange([null, null]);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onSelectedRowsChange]);

  return (
    <>
      <Scrollbar>
        <TableContainer sx={{ 
          minWidth: { xs: "100%", sm: 600, md: 800 }, 
          maxHeight: { xs: "calc(100vh - 250px)", sm: "calc(100vh - 280px)" },
          overflowX: "auto"
        }}>
          <Table aria-label="sticky table" size="small" stickyHeader sx={{ width: "100%" }}>
            <TableHead>
              <TableRow>
                {selectable && (
                  <TableCell 
                    padding="checkbox"
                    sx={{
                      position: "sticky",
                      left: 0,
                      top: 0,
                      zIndex: 4,
                      backgroundColor: "background.paper",
                      boxShadow: "2px 0 5px -2px rgba(0,0,0,0.1)",
                      borderBottom: "1px solid rgba(224, 224, 224, 1)",
                    }}
                  >
                    <Checkbox
                      indeterminate={
                        selectedRows.length > 0 &&
                        selectedRows.length < filteredData.length
                      }
                      checked={
                        filteredData.length > 0 &&
                        selectedRows.length === filteredData.length
                      }
                      onChange={handleSelectAllRows}
                    />
                  </TableCell>
                )}
                {columns
                  .filter((column) => selectedColumns.includes(column.id))
                  .map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align || "left"}
                      sx={{
                        minWidth: { xs: "auto", sm: column.minWidth || 100 },
                        px: { xs: 0.5, sm: 1, md: 2 },
                        py: { xs: 0.75, sm: 1 },
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        position: "sticky",
                        top: 0,
                        zIndex: 3,
                        backgroundColor: "background.paper",
                        borderBottom: "1px solid rgba(224, 224, 224, 1)",
                        whiteSpace: "nowrap",
                        ...(column.sticky && {
                          [column.sticky]: column.stickyOffset || 0,
                          zIndex: 4,
                          boxShadow: column.sticky === "left" 
                            ? "2px 0 5px -2px rgba(0,0,0,0.1)" 
                            : "-2px 0 5px -2px rgba(0,0,0,0.1)",
                        }),
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                {renderActions && (
                  <TableCell 
                    align="right"
                    sx={{
                      position: "sticky",
                      top: 0,
                      zIndex: 3,
                      backgroundColor: "background.paper",
                      borderBottom: "1px solid rgba(224, 224, 224, 1)",
                    }}
                  />
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {/* {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow
                    hover
                    key={row._id || index}
                    onClick={() => onRowClick?.(row)}
                    sx={{
                      cursor: onRowClick ? "pointer" : "default",
                      borderBottom: "1px solid #e0e0e0",
                    }}
                  >
                    {columns
                      .filter((column) => selectedColumns.includes(column.id))
                      .map((column) => (
                        <TableCell
                          key={`${row._id || index}-${column.id}`}
                          align={column.align || "left"}
                        >
                          {renderCellValue(row, column)}
                        </TableCell>
                      ))}
                    {renderActions && (
                      <TableCell align="right">{renderActions(row)}</TableCell>
                    )}
                  </TableRow>
                ))} */}
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const rowId = row._id || row.id || index.toString();
                  const isSelected = selectedRows.includes(rowId);

                  return (
                    <TableRow
                      hover
                      key={rowId}
                      // onClick={() => onRowClick?.(row)}
                      sx={{
                        cursor: onRowClick ? "pointer" : "default",
                        borderBottom: "1px solid rgba(224, 224, 224, 1)",
                        bgcolor: row.isDeleted
                          ? "rgba(255, 0, 0, 0.6)"
                          : "inherit",
                        "&:last-child": {
                          borderBottom: "1px solid rgba(224, 224, 224, 1)",
                        },
                      }}
                    >
                      {selectable && (
                        <TableCell 
                          padding="checkbox"
                          sx={{
                            position: "sticky",
                            left: 0,
                            zIndex: 1,
                            backgroundColor: "background.paper",
                            boxShadow: "2px 0 5px -2px rgba(0,0,0,0.1)",
                            borderBottom: "1px solid rgba(224, 224, 224, 1)",
                          }}
                        >
                          <Checkbox
                            checked={isSelected}
                            onClick={(event) => handleSelectRow(event, rowId)}
                          />
                        </TableCell>
                      )}
                      {columns
                        .filter((column) => selectedColumns.includes(column.id))
                        .map((column) => (
                          <TableCell
                            key={`${rowId}-${column.id}`}
                            align={column.align || "left"}
                            onClick={() => onRowClick?.(row)}
                            sx={{
                              px: { xs: 0.5, sm: 1, md: 2 },
                              py: { xs: 0.75, sm: 1 },
                              fontSize: { xs: "0.75rem", sm: "0.875rem" },
                              borderBottom: "1px solid rgba(224, 224, 224, 1)",
                              ...(column.sticky && {
                                position: "sticky",
                                [column.sticky]: column.stickyOffset || 0,
                                zIndex: 1,
                                backgroundColor: "background.paper",
                                boxShadow: column.sticky === "left" 
                                  ? "2px 0 5px -2px rgba(0,0,0,0.1)" 
                                  : "-2px 0 5px -2px rgba(0,0,0,0.1)",
                              }),
                            }}
                          >
                            {renderCellValue(row, column)}
                          </TableCell>
                        ))}
                      {renderActions && (
                        <TableCell 
                          align="right"
                          sx={{
                            borderBottom: "1px solid rgba(224, 224, 224, 1)",
                          }}
                        >
                          {renderActions(row)}
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}

              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={selectedColumns.length} />
                </TableRow>
              )}

              {notFound && (
                <TableNoData
                  columns={columns.length}
                  searchQuery={filterName}
                />
              )}
              {isEmpty && (
                <TableNoData
                  columns={columns.length}
                  searchQuery={noDataText}
                />
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          position: "sticky",
          bottom: 0,
          zIndex: 1000,
          backgroundColor: "white",
          borderBottom: "1px solid #eee",
        }}
      />
    </>
  );
}
