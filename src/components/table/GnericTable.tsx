// src/components/table/GenericTable.tsx
import type { useTableLogic } from "src/hooks/useTableLogic";

import { Card } from "@mui/material";

import { TableSort } from "./TableSort";
import { TableComponent } from "./Table";
import { TableFilters } from "./TableFilters";
import { TableToolbar } from "./TableToolbar";
import { TableColumnSelector } from "./TableColumnSelector";

import type { Column } from "./types";

interface GenericTableProps<T extends Record<string, any>> {
  data: T[];
  selectable?: boolean;
  columns: Column[];
  renderActions?: (row: T) => React.ReactNode;
  onRowClick?: (row: T) => void;
  logic: ReturnType<typeof useTableLogic<T>>;
  setSelectedRows?: (selected: string[]) => void;
  selectedRows?: string[];
  component?: React.ReactNode;
  calendar?: React.ReactNode;
}

export function GenericTable<T extends Record<string, any>>({
  data,
  selectable = false,
  columns,
  renderActions,
  onRowClick,
  logic,
  setSelectedRows,
  selectedRows,
  component,
  calendar,
}: GenericTableProps<T>) {
  const {
    filterAnchorEl,
    sortAnchorEl,
    columnAnchorEl,
    setFilterAnchorEl,
    setSortAnchorEl,
    setColumnAnchorEl,
    selectedColumns,
    searchText,
    setSearchText,
    filteredData,
    filterValues,
    handleFilterChange,
    handleClearFilters,
    sortConfig,
    handleSort,
    handleColumnToggle,
  } = logic;

  // console.log("select data", selectedRows);

  return (
    <>
      <TableFilters
        anchorEl={filterAnchorEl}
        onClose={() => setFilterAnchorEl(null)}
        columns={columns}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        onApplyFilters={() => setFilterAnchorEl(null)}
      />
      <TableSort
        anchorEl={sortAnchorEl}
        onClose={() => setSortAnchorEl(null)}
        columns={columns}
        sortConfig={sortConfig}
        onSort={handleSort}
      />
      <TableColumnSelector
        anchorEl={columnAnchorEl}
        onClose={() => setColumnAnchorEl(null)}
        columns={columns}
        selectedColumns={selectedColumns}
        onColumnToggle={handleColumnToggle}
      />
      <Card sx={{ overflow: "auto", maxHeight: "80vh" }}>
        <TableToolbar
          onFilterClick={(e) => setFilterAnchorEl(e.currentTarget)}
          onSortClick={(e) => setSortAnchorEl(e.currentTarget)}
          onColumnClick={(e) => setColumnAnchorEl(e.currentTarget)}
          searchText={searchText}
          onSearchChange={setSearchText}
          component={component}
          calendar={calendar}
        />
        <TableComponent
          columns={columns}
          data={filteredData}
          selectedColumns={selectedColumns}
          onRowClick={onRowClick}
          renderActions={renderActions}
          selectable={selectable}
          onSelectedRowsChange={setSelectedRows}
          selectedRowss={selectedRows}
        />
      </Card>
    </>
  );
}
