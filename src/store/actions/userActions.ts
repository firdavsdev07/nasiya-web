import type {
  IUserApproved,
  IUserAddCourse,
  IUserAddTutorial,
} from "src/types/user";

import authApi from "src/server/auth";

import {
  start,
  failure,
  setUsers,
  startApproved,
  failureApproved,
  successApproved,
} from "../slices/userSlice";

import type { AppThunk } from "../index";

export const getUsers = (): AppThunk => async (dispatch) => {
  dispatch(start());
  try {
    const res = await authApi.get("/user/get-all");

    const { data } = res;

    dispatch(setUsers(data));
  } catch (error: any) {
    dispatch(failure());
  }
};


export const approvedUser =
  (data: IUserApproved): AppThunk =>
  async (dispatch) => {
    dispatch(startApproved());
    try {
      await authApi.put("/user/approved-user/", data);
      dispatch(getUsers());
      dispatch(successApproved());
    } catch (error: any) {
      dispatch(failureApproved());
    }
  };

export const addUserCourse =
  (data: IUserAddCourse): AppThunk =>
  async (dispatch) => {
    // dispatch(start());
    try {
      await authApi.put("/user/add-user-course", data);
      dispatch(getUsers());
      // dispatch(success());
    } catch (error: any) {
      // dispatch(failure());
    }
  };
export const addUserTutorial =
  (data: IUserAddTutorial): AppThunk =>
  async (dispatch) => {
    // dispatch(start());
    try {
      await authApi.put("/user/add-user-tutorial", data);
      dispatch(getUsers());
      // dispatch(success());
    } catch (error: any) {
      // dispatch(failure());
    }
  };

// export const updateCourse =
//   (data: IEditCourse): AppThunk =>
//   async (dispatch) => {
//     dispatch(start());
//     try {
//       await authApi.put("/course/", data);
//       dispatch(getCourses());
//       dispatch(success());
//     } catch (error: any) {
//       dispatch(failure());
//     }
//   };

// export const deleteCourse =
//   (id: string): AppThunk =>
//   async (dispatch) => {
//     dispatch(start());
//     try {
//       await authApi.delete(`/course/${id}`);
//       dispatch(getCourses());
//       dispatch(success());
//     } catch (error: any) {
//       dispatch(failure());
//     }
//   };

/// ////////////
