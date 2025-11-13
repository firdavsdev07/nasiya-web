import type { Column } from "src/components/table/types";

export const columnsCash: Column[] = [
  {
    id: "customerId",
    label: "Mijoz",
    sortable: true,
    renderCell: (row) => {
      if (row.customerId) {
        return `${row.customerId.firstName || ""} ${row.customerId.lastName || ""}`;
      }
      return "—";
    },
  },
  {
    id: "managerId",
    label: "Menejer",
    sortable: true,
    renderCell: (row) => {
      // Mijozga biriktirilgan menејerni ko'rsatish
      if (row.customerId && row.customerId.manager) {
        return `${row.customerId.manager.firstName || ""} ${row.customerId.manager.lastName || ""}`;
      }
      // Agar mijozda menejer bo'lmasa, to'lovni qabul qilgan menејerni ko'rsatish
      if (row.managerId) {
        return `${row.managerId.firstName || ""} ${row.managerId.lastName || ""}`;
      }
      return "—";
    },
  },
  {
    id: "amount",
    label: "Summa",
    format: (value: number) => `${value?.toLocaleString() || 0} $`,
  },
  {
    id: "date",
    label: "Sana",
    renderCell: (row) => {
      if (row.date) {
        return new Date(row.date).toLocaleDateString("uz-UZ");
      }
      return "—";
    },
  },
  {
    id: "delayDays",
    label: "Kechikish",
    sortable: true,
    renderCell: (row) => {
      if (!row.date) return "—";

      const paymentDate = new Date(row.date);
      const today = new Date();
      const delayDays = Math.floor(
        (today.getTime() - paymentDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (delayDays <= 0) {
        return "—";
      }

      // Emoji va rang (Requirements 6.1-6.5)
      if (delayDays > 30) {
        return `🔴 ${delayDays} kun`;
      } else if (delayDays >= 8) {
        return `🟡 ${delayDays} kun`;
      }
      return `${delayDays} kun`;
    },
  },
  {
    id: "status",
    label: "Holat",
    sortable: true,
    renderCell: (row) => {
      const statusMap: Record<string, string> = {
        PENDING: "⏳ Kutilmoqda",
        PAID: "✅ To'langan",
        REJECTED: "❌ Rad etilgan",
        UNDERPAID: "⚠️ Kam to'langan",
        OVERPAID: "💰 Ko'p to'langan",
      };
      return statusMap[row.status] || row.status || "—";
    },
  },
  {
    id: "notes",
    label: "Izoh",
    renderCell: (row) => {
      if (row.notes && typeof row.notes === "object" && "text" in row.notes) {
        const text = row.notes.text || "—";
        // Uzun matnni qisqartirish
        return text.length > 50 ? text.substring(0, 50) + "..." : text;
      }
      return row.notes || "—";
    },
  },
];
