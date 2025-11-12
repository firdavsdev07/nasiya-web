// import type { IUser } from "src/types/user";
import type { IPayment } from "src/types/cash";
import type { IDebt } from "src/types/debtor";
import type { IMeneger } from "src/types/meneger";
import type { IEmployee } from "src/types/employee";
import type { ICustomer } from "src/types/customer";
import type { IContract } from "src/types/contract";
import type { PayloadAction } from "@reduxjs/toolkit";

import { createSlice } from "@reduxjs/toolkit";

// modal type
type ModalType = "add" | "edit" | "info" | "reject" | undefined;

// reusable modal structure
type ModalData<T> = {
  type: ModalType;
  data?: T;
};

// Modal state interface
export interface ModalState {
  employeeModal: ModalData<IEmployee>;
  customerModal: ModalData<ICustomer>;

  contractModal: ModalData<IContract>;

  debtorModal: ModalData<IDebt>;
  // userModal: ModalData<IUser>;

  cashModal: ModalData<IPayment>; // Changed from ICash to IPayment
  cashInfoModal: ModalData<IPayment>; // ✅ IPayment bo'lishi kerak, ICustomer emas
  cashRejectModal: ModalData<IPayment>;
  menegerModal: ModalData<IMeneger>;
  dashboardModal: ModalData<number>;
}

// Initial state
export const initialState: ModalState = {
  employeeModal: { type: undefined, data: undefined },
  customerModal: { type: undefined, data: undefined },

  contractModal: { type: undefined, data: undefined },
  debtorModal: { type: undefined, data: undefined },
  // userModal: { type: undefined, data: undefined },
  cashModal: { type: undefined, data: undefined },
  cashInfoModal: { type: undefined, data: undefined },
  cashRejectModal: { type: undefined, data: undefined },
  // courseModal: { type: undefined, data: undefined },
  // tutorialModal: { type: undefined, data: undefined },
  // serviceModal: { type: undefined, data: undefined },
  // channelModal: { type: undefined, data: undefined },
  // courseForModal: { type: undefined, data: undefined },
  // moduleModal: { type: undefined, data: undefined },
  // lessonModal: { type: undefined, data: undefined },
  // videoModal: { type: undefined, data: undefined },
  // userCourseModal: { type: undefined, data: undefined },
  // userTutorialModal: { type: undefined, data: undefined },
  menegerModal: { type: undefined, data: undefined },
  dashboardModal: { type: undefined, data: undefined },
};

// modal slice
const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setModal<T>(
      state: ModalState,
      action: PayloadAction<{ modal: keyof ModalState; data: ModalData<T> }>
    ) {
      const { modal, data } = action.payload;
      (state[modal] as ModalData<T>) = data;
    },
    closeModal(state, action: PayloadAction<keyof ModalState>) {
      const modal = action.payload;
      Object.assign(state[modal], {
        type: undefined,
        data: undefined,
      });
    },
  },
});

export const { setModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
