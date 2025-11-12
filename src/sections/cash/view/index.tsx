// import type { RootState } from "src/store";
// import type { TypedUseSelectorHook } from "react-redux";

// import { useEffect } from "react";
// import { useSelector } from "react-redux";

// import { useAppDispatch } from "src/hooks/useAppDispatch";

// import { setUserData } from "src/store/slices/userSlice";

import { CashView } from "./cash-view";
// import { ModalCash } from "../modal/modal-cash";
import ModalCash from "../modal/modal-cash";
import ModalCashInfo from "../modal/modal-cash-info";
import ModalCashReject from "../modal/modal-cash-reject";
// import { UserDetails } from "./user-detail";
// import ModalUserCourses from "../modal/modal-user-course";
// import ModalUserTutorials from "../modal/modal-user-tutorial";

// ----------------------------------------------------------------------
// const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export function CashesView() {
  // const dispatch = useAppDispatch();
  // const { user } = useTypedSelector((state) => state.user);

  // useEffect(() => {
  //   if (user) {
  //     const data = users.find((cr) => cr._id === user?._id);
  //     dispatch(setUserData(data || null));
  //   }
  // }, [user, users, dispatch]);

  return (
    <>
      {/* {user ? <UserDetails /> : <UserView />} */}
      <CashView />
      {/* <UserView /> */}
      {/* <ModalUserCourses />
      <ModalUserTutorials /> */}
      <ModalCash />
      <ModalCashInfo />
      <ModalCashReject />
    </>
  );
}
