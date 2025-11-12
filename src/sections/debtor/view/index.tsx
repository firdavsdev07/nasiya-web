import { useEffect } from "react";

import { useAppDispatch } from "src/hooks/useAppDispatch";

import { getManagers } from "src/store/actions/employeeActions";

import { DebtorView } from "./debtor-view";

export function UsersView() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getManagers());
    // dispatch(setCustomerId(null));
  }, [dispatch]);
  return <DebtorView />;
}
