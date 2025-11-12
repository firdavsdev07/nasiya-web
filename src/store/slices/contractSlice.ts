import type { IContract } from "src/types/contract";
import type { PayloadAction } from "@reduxjs/toolkit";

import { createSlice } from "@reduxjs/toolkit";

// interface ICustomerWithManager extends ICustomer {
//   manager?: IEmployee;
// }

// export interface ICustomerContract extends IContract {
//   // customer?: ICustomerWithManager;
// }

export interface UserState {
  contracts: IContract[] | [];
  newContracts: IContract[];
  completedContracts: IContract[] | [];
  contractId: string | null;
  contract: IContract | null;

  // customer: ICustomer | null;
  isLoading: boolean;
}

const initialState: UserState = {
  contracts: [],
  newContracts: [],
  completedContracts: [],
  contractId: null,
  contract: null,
  // customer: null,
  isLoading: false,
};

const authSlice = createSlice({
  name: "contract",
  initialState,
  reducers: {
    setContracts(state, action: PayloadAction<IContract[] | []>) {
      state.isLoading = false;
      state.contracts = action.payload;
    },
    setNewContracts(state, action: PayloadAction<IContract[] | []>) {
      state.isLoading = false;
      state.newContracts = action.payload;
    },
    setCompletedContracts(state, action: PayloadAction<IContract[] | []>) {
      state.isLoading = false;
      state.completedContracts = action.payload;
    },
    setContractId(state, action: PayloadAction<string | null>) {
      state.isLoading = false;
      state.contractId = action.payload;
    },
    setContract(state, action: PayloadAction<IContract | null>) {
      state.isLoading = false;
      state.contract = action.payload;
    },

    // setCustomer(state, action: PayloadAction<ICustomer | null>) {
    //   state.isLoading = false;
    //   state.customer = action.payload;
    // },

    start(state) {
      state.isLoading = true;
    },

    success(state) {
      state.isLoading = false;
    },
    failure(state) {
      state.isLoading = false;
    },
  },
});

export const {
  start,
  failure,
  success,
  // setCustomer,
  setContracts,
  setContractId,
  setContract,
  setNewContracts,
  setCompletedContracts,
} = authSlice.actions;
export default authSlice.reducer;
