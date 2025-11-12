import type { Column, SortConfig } from "src/components/table/types";

import { useMemo, useState } from "react";

export function useTableLogic<T extends Record<string, any>>(
  data: T[],
  columns: Column[]
) {
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const [columnAnchorEl, setColumnAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [selectedColumns, setSelectedColumns] = useState(
    columns.map((col) => col.id)
  );
  const [searchText, setSearchText] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(null);

  const filteredData = useMemo(() => {
    let result = [...data];
    const searchableFields = [
      "fullName",
      "manager",
      "phoneNumber",
      "customerName",
      "productName",
    ];

    // Search
    if (searchText) {
      const lowerSearch = searchText.toLowerCase();
      // result = result.filter((item) =>
      //   Object.values(item).some(
      //     (value) =>
      //       value &&
      //       value.toString().toLowerCase().includes(searchText.toLowerCase())
      //   )
      // );
      result = result.filter((item) =>
        searchableFields.some((key) => {
          const value = item[key];
          return value && value.toString().toLowerCase().includes(lowerSearch);
        })
      );
    }

    // Filters
    Object.entries(filterValues).forEach(([key, value]) => {
      if (value) {
        result = result.filter((item) => {
          const itemValue = item[key];
          if (typeof itemValue === "string") {
            return itemValue.toLowerCase().includes(value.toLowerCase());
          }
          if (typeof itemValue === "number") {
            return itemValue.toString().includes(value);
          }
          return true;
        });
      }
    });

    // Sorting
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchText, filterValues, sortConfig]);

  const handleColumnToggle = (columnId: string) => {
    setSelectedColumns((prev) =>
      prev.includes(columnId)
        ? prev.filter((id) => id !== columnId)
        : [...prev, columnId]
    );
  };

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (columnId: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [columnId]: value }));
  };

  const handleClearFilters = () => {
    setFilterValues({});
    setSearchText("");
    setSortConfig(null);
  };

  return {
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
  };
}
