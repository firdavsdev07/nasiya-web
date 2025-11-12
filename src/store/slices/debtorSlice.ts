import type { IDebt } from "src/types/debtor";
import type { PayloadAction } from "@reduxjs/toolkit";

import { createSlice } from "@reduxjs/toolkit";

export interface UserState {
  debtors: IDebt[];
  debtContracts: IDebt[];
  isLoading: boolean;
}

const initialState: UserState = {
  debtors: [],
  debtContracts: [],
  isLoading: false,
};

const authSlice = createSlice({
  name: "contract",
  initialState,
  reducers: {
    setDebtors(state, action: PayloadAction<IDebt[] | []>) {
      state.isLoading = false;
      state.debtors = action.payload;
    },
    setDebtContract(state, action: PayloadAction<IDebt[] | []>) {
      state.isLoading = false;
      state.debtContracts = action.payload;
    },
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

export const { setDebtors, setDebtContract, start, success, failure } =
  authSlice.actions;
export default authSlice.reducer;
