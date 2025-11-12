import type { RootState } from "src/store";
import type { TypedUseSelectorHook } from "react-redux";

import { useEffect } from "react";
import { useSelector } from "react-redux";

import { useAppDispatch } from "src/hooks/useAppDispatch";

import { setContractId } from "src/store/slices/contractSlice";

import ModalCustomer from "src/sections/customer/modal/modal-customer";

import { ContractsView } from "./contract-view";
import ContractDetails from "./contract-detail";
import ModalContract from "../modal/modal-contract";

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export function UsersView() {
  const dispatch = useAppDispatch();
  const { contractId } = useTypedSelector((state) => state.contract);

  useEffect(() => {
    dispatch(setContractId(null));
  }, [dispatch]);
  return (
    <>
      {contractId ? <ContractDetails /> : <ContractsView />}
      <ModalContract />
      <ModalCustomer show />
    </>
  );
}
