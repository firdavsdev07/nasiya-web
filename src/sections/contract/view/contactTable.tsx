import type { IContract } from "src/types/contract";
import type { Column } from "src/components/table/types";

import { useTableLogic } from "src/hooks/useTableLogic";

import { GenericTable } from "src/components/table/GnericTable";

interface ContractTableProps {
  data: IContract[];
  columns: Column[];
  onRowClick: (row: IContract) => void;
  renderActions?: (row: IContract) => React.ReactNode;
}

const ContractTable = ({
  data,
  columns,
  onRowClick,
  renderActions,
}: ContractTableProps) => {
  const logic = useTableLogic<IContract>(data, columns);

  return (
    <GenericTable
      data={data}
      columns={columns}
      logic={logic}
      onRowClick={onRowClick}
      renderActions={renderActions}
    />
  );
};

export default ContractTable;
