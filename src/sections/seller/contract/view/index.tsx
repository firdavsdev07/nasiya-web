import type { RootState } from "src/store";
import type { TypedUseSelectorHook } from "react-redux";

import { memo } from "react";
import { useSelector } from "react-redux";

import ContractsView from "./contract-view";
import ContractDetails from "./contract-detail";
import ModalContract from "../modal/modal-contract";
import ModalCustomer from "../../customer/modal/modal-customer";

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

const ContractView = () => {
  const { contractId } = useTypedSelector((state) => state.contract);

  console.log("render contract");

  return (
    <>
      {contractId ? <ContractDetails /> : <ContractsView />}
      <ModalContract />
      <ModalCustomer show />
    </>
  );
};

export default memo(ContractView);
