import type { RootState } from "src/store";
import type { TypedUseSelectorHook } from "react-redux";

// import { useEffect } from "react";
import { useSelector } from "react-redux";

// import { useAppDispatch } from "src/hooks/useAppDispatch";

// import { setEmployeeId } from "src/store/slices/employeeSlice";

import { EmployeesView } from "./employees-view";
import EmployeeDetails from "./employee-details";
import ModalEmployees from "../modal/modal-employee";

// ----------------------------------------------------------------------
const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export function EmployeessView() {
  // const dispatch = useAppDispatch();
  const { employeeId } = useTypedSelector((state) => state.employee);

  // useEffect(() => {
  //   dispatch(setEmployeeId(null));
  // }, [dispatch]);
  return (
    <>
      {employeeId ? <EmployeeDetails /> : <EmployeesView />}
      <ModalEmployees />
    </>
  );
}
