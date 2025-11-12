import type { ICustomer } from "src/types/customer";
import type { Column } from "src/components/table/types";

import { useTableLogic } from "src/hooks/useTableLogic";

import { GenericTable } from "src/components/table/GnericTable";

interface CustomerTableProps {
  data: ICustomer[];
  columns: Column[];
  onRowClick?: (row: ICustomer) => void;
}

const CustomerTable = ({ data, columns, onRowClick }: CustomerTableProps) => {
  const logic = useTableLogic<ICustomer>(data, columns);

  return (
    <GenericTable
      data={data}
      columns={columns}
      logic={logic}
      onRowClick={onRowClick}
    />
  );
};

export default CustomerTable;
