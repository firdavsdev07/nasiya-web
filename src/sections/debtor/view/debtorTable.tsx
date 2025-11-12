import type { IDebt } from "src/types/debtor";
import type { Column } from "src/components/table/types";

import { useTableLogic } from "src/hooks/useTableLogic";
import { useAppDispatch } from "src/hooks/useAppDispatch";

import { updateDebCustomerManager } from "src/store/actions/debtorActions";

import { GenericTable } from "src/components/table/GnericTable";

import { ManagerSelectCellDebtor } from "./ManagerSelectCell";

interface DEbtorTableProps {
  data: IDebt[];
  columns: Column[];
  onRowClick?: (row: IDebt) => void;
  selectable?: boolean;
  setSelectedRows?: (selected: string[]) => void;
  selectedRows?: string[];
  component?: React.ReactNode;
  calendar?: React.ReactNode;
}

const DebtorTable = ({
  data,
  columns,
  onRowClick,
  selectable,
  setSelectedRows,
  selectedRows,
  component,
  calendar,
}: DEbtorTableProps) => {
  const dispatch = useAppDispatch();
  const logic = useTableLogic<IDebt>(data, columns);

  const handleManagerChange = (customerId: string, newManager: string) => {
    dispatch(updateDebCustomerManager(customerId, newManager));
  };

  const enhancedColumns = columns.map((col) => {
    if (col.id === "manager") {
      return {
        ...col,
        renderCell: (row: any) => (
          <ManagerSelectCellDebtor
            row={row}
            value={row.manager}
            onManagerChange={handleManagerChange}
          />
        ),
      };
    }
    return col;
  });

  return (
    <GenericTable
      data={data}
      selectable={selectable}
      // columns={columns}
      columns={enhancedColumns}
      logic={logic}
      onRowClick={onRowClick}
      setSelectedRows={setSelectedRows}
      selectedRows={selectedRows}
      component={component}
      calendar={calendar}
      // renderActions={(row) => <ActionContract contract={row} />}
    />
  );
};

export default DebtorTable;
