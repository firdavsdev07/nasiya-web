import type { IPayment } from "src/types/cash";
import type { Column } from "src/components/table/types";

import { useTableLogic } from "src/hooks/useTableLogic";

import { GenericTable } from "src/components/table/GnericTable";

interface ChashTableProps {
  data: IPayment[];
  columns: Column[];
  onRowClick?: (row: IPayment) => void;
  selectable?: boolean;
  setSelectedRows?: (selected: string[]) => void;
  component?: React.ReactNode;
  renderActions: (row: IPayment) => React.ReactNode;
}

const ChashTable = ({
  data,
  columns,
  onRowClick,
  selectable,
  setSelectedRows,
  component,
  renderActions,
}: ChashTableProps) => {
  const logic = useTableLogic<IPayment>(data, columns);

  return (
    <GenericTable
      data={data}
      selectable={selectable}
      columns={columns}
      logic={logic}
      onRowClick={onRowClick}
      setSelectedRows={setSelectedRows}
      component={component}
      renderActions={renderActions}
    />
  );
};

export default ChashTable;
