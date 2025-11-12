import type { RootState } from "src/store";
import type { TypedUseSelectorHook } from "react-redux";

import { memo, useEffect } from "react";
import { useSelector } from "react-redux";

import { useAppDispatch } from "src/hooks/useAppDispatch";

// import { setCustomerId } from "src/store/slices/customerSlice";
import { getManagers } from "src/store/actions/employeeActions";

import CustomerView from "./customer-view";
import ModalCustomer from "../modal/modal-customer";
import { CustomerDetails } from "./customer-detail/customer-detail";

// ----------------------------------------------------------------------
const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

const CustomersView = () => {
  const dispatch = useAppDispatch();

  const { customerId } = useTypedSelector((state) => state.customer);

  useEffect(() => {
    dispatch(getManagers());
    // dispatch(setCustomerId(null));
  }, [dispatch]);
  return (
    <>
      {customerId ? <CustomerDetails /> : <CustomerView />}
      <ModalCustomer />
    </>
  );
};

export default memo(CustomersView);
