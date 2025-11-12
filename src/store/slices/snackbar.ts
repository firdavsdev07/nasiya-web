import type { WritableDraft } from "immer";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { OptionsObject, SnackbarMessage } from "notistack";

import { createSlice } from "@reduxjs/toolkit";

export interface SnackbarState {
  messages: {
    message: SnackbarMessage;
    options?: OptionsObject;
  }[];
}

const initialState: SnackbarState = {
  messages: [],
};

const snackbarSlice = createSlice({
  name: "snackbars",
  initialState,
  reducers: {
    enqueueSnackbar: (
      state,
      action: PayloadAction<{
        message: SnackbarMessage;
        options?: WritableDraft<OptionsObject>;
      }>
    ) => {
      state.messages.push({
        message: action.payload.message,
        options: action.payload.options,
      });
    },
    removeSnackbar: (state) => {
      state.messages.shift();
    },
  },
});

export const { enqueueSnackbar, removeSnackbar } = snackbarSlice.actions;

export default snackbarSlice.reducer;
