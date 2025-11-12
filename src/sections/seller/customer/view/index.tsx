import type { RootState } from "src/store";
import type { TypedUseSelectorHook } from "react-redux";

import { memo, useEffect } from "react";
import { useSelector } from "react-redux";

import { useAppDispatch } from "src/hooks/useAppDispatch";

import { setCustomer } from "src/store/slices/customerSlice";

import CustomerView from "./customer-view";
import ModalCustomer from "../modal/modal-customer";
import { CustomerDetails } from "./customer-detail";

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

const CustomersView = () => {
  const dispatch = useAppDispatch();
  const { customerId } = useTypedSelector((state) => state.customer);

  console.log("render user");

  // customerId null bo'lganda customer ma'lumotlarini tozalash
  useEffect(() => {
    if (!customerId) {
      dispatch(setCustomer(null));
    }
  }, [customerId, dispatch]);

  return (
    <>
      {customerId ? <CustomerDetails /> : <CustomerView />}
      <ModalCustomer />
    </>
  );
};

export default memo(CustomersView);
