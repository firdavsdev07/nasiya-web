import type { Column } from "src/components/table/types";

export const columnsPageCustomers: Column[] = [
  {
    id: "firstName",
    label: "Ism",
    sortable: true,
  },
  {
    id: "lastName",
    label: "Familiya",
    sortable: true,
    format: (value: any) => (value ? `${value}` : "—"),
  },
  {
    id: "contractCount",
    label: "Shartnomalar",
    align: "center",
    format: (value: number) => `${value ? value.toLocaleString() : 0}`,
    sortable: true,
  },
  {
    id: "phoneNumber",
    label: "Telefon raqami",
    sortable: true,
    format: (value: any) => (value ? `${value}` : "—"),
  },
  {
    id: "address",
    label: "Manzil",
    sortable: true,
    format: (value: any) => (value ? `${value}` : "—"),
  },

  {
    id: "passportSeries",
    label: "Password seriya",
    sortable: true,
    format: (value: any) => (value ? `${value}` : "—"),
  },
  {
    id: "birthDate",
    label: "Tug'ilgan sana",
    sortable: true,
    format: (value: any) =>
      value ? new Date(value).toLocaleDateString() : "—",
  },
  {
    id: "manager",
    label: "Menejer",
    sortable: false,
    // format: (value: any) =>
    // value && value.firstName ? `${value.firstName} ${value.lastName}` : "—",
  },
];

export const columnsNewPageCustomers: Column[] = [
  {
    id: "firstName",
    label: "Ism",
    sortable: true,
  },
  {
    id: "lastName",
    label: "Familiya",
    sortable: true,
    format: (value: any) => (value ? `${value}` : "—"),
  },
  {
    id: "phoneNumber",
    label: "Telefon raqami",
    sortable: true,
    format: (value: any) => (value ? `${value}` : "—"),
  },
  {
    id: "address",
    label: "Manzil",
    sortable: true,
    format: (value: any) => (value ? `${value}` : "—"),
  },

  {
    id: "passportSeries",
    label: "Password seriya",
    sortable: true,
    format: (value: any) => (value ? `${value}` : "—"),
  },
  {
    id: "birthDate",
    label: "Tug'ilgan sana",
    sortable: true,
    format: (value: any) =>
      value ? new Date(value).toLocaleDateString() : "—",
  },
];
