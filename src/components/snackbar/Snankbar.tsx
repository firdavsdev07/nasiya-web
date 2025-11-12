/* eslint-disable import/no-extraneous-dependencies */
import type { TypedUseSelectorHook } from "react-redux";

import { useEffect } from "react";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";

// import { removeSnackbar } from "../../store/slices/snackbar";

import { removeSnackbar } from "src/store/slices/snackbar";

import type { RootState } from "../../store/index";

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

const Snackbar: React.FC = () => {
  const dispatch = useDispatch();
  const messages = useTypedSelector((state) => state.snackbars.messages);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (messages.length > 0) {
      const { message, options } = messages[0];
      // Faqat message mavjud bo'lsa enqueue qilish
      if (message) {
        enqueueSnackbar(message, options);
      }
      dispatch(removeSnackbar());
    }
  }, [dispatch, enqueueSnackbar, messages]);

  return null;
};

export default Snackbar;
