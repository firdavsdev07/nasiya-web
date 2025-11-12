import type { Column } from "src/components/table/types";

export const columnsPageContract: Column[] = [
  {
    id: "day",
    label: "Kun",
    sortable: true,
    renderCell: (row) => {
      if (row.startDate) {
        const day = new Date(row.startDate).getDate();
        return day.toString().padStart(2, "0");
      }
      return "—";
    },
  },
  {
    id: "customerName",
    label: "Mijoz",
    sortable: true,
    renderCell: (row) => {
      // Agar customerName'da kun bor bo'lsa, uni olib tashlash
      if (row.customerName && typeof row.customerName === "string") {
        // "08 Behruz Choriyev" -> "Behruz Choriyev"
        const parts = row.customerName.split(" ");
        // Agar birinchi qism raqam bo'lsa, uni olib tashlash
        if (parts.length > 1 && !isNaN(Number(parts[0]))) {
          return parts.slice(1).join(" ");
        }
        return row.customerName;
      }
      return row.customerName || "—";
    },
  },
  { id: "productName", label: "Mahsulot Nomi", sortable: true },
  {
    id: "startDate",
    label: "Shartnoma Sanasi",
    format: (value: number) => value.toString().split("T")[0],
    sortable: true,
  },
  {
    id: "totalPrice",
    label: "Narxi",
    format: (value: number) => `${value.toLocaleString()} $`,
    sortable: true,
  },
  {
    id: "initialPayment",
    label: "Oldindan To'lov",
    format: (value: number) => `${value.toLocaleString()} $`,
    sortable: true,
  },

  {
    id: "monthlyPayment",
    label: "Oylik To'lov Miqdori",
    align: "center",
    format: (value: number) => `${value.toLocaleString()} $`,
    sortable: true,
  },
  {
    id: "totalPaid",
    label: "To'langan",
    align: "center",
    format: (value: number) => `${value?.toLocaleString() || 0} $`,
    sortable: true,
  },
  {
    id: "remainingDebt",
    label: "Qolgan qarz",
    align: "center",
    format: (value: number) => `${value?.toLocaleString() || 0} $`,
    sortable: true,
  },
];

export const columnsPageNewContract: Column[] = [
  { id: "productName", label: "Mahsulot Nomi", sortable: true },
  { id: "customerName", label: "Mijoz", sortable: true },
  { id: "sellerName", label: "Seller", sortable: true },
  {
    id: "price",
    label: "Narxi",
    format: (value: number) => `${value.toLocaleString()} $`,
    sortable: true,
  },
  {
    id: "initialPayment",
    label: "Oldindan To'lov",
    format: (value: number) => `${value.toLocaleString()} $`,
    sortable: true,
  },
  {
    id: "notes",
    label: "Izoh",
  },
  {
    id: "actions",
    label: "Amallar",
    align: "center",
  },
];
