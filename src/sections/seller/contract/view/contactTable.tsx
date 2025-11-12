import type { IContract } from "src/types/contract";
import type { Column } from "src/components/table/types";

import { useTableLogic } from "src/hooks/useTableLogic";

import { GenericTable } from "src/components/table/GnericTable";

interface ContractTableProps {
  data: IContract[];
  columns: Column[];
  onRowClick?: (row: IContract) => void;
}

const ContractTable = ({ data, columns, onRowClick }: ContractTableProps) => {
  const logic = useTableLogic<IContract>(data, columns);

  return (
    <GenericTable
      data={data}
      columns={columns}
      logic={logic}
      onRowClick={onRowClick}
    />
  );
};

export default ContractTable;
