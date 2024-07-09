//! createSlice will automatically creates redusers and actions
import { createSlice } from "@reduxjs/toolkit";

//! Initial State
// name should be unique and determines the kind of action you want to take
// since this slice is only related to User, we will define initial value of user as "null"
const authSlice = createSlice({
  name: "auth",
  initialState: {
    // check if "userInfo" stored already in localStorage, otherwise null
    user: JSON.parse(localStorage.getItem("userInfo")) || null,
  },
  //* 1. Reducers
  reducers: {
    loginAction: (state, action) => {
      // set the payload data as a new state
      state.user = action.payload;
    },
    logoutAction: (state, action) => {
      // remove user data when logout
      state.user = null;
    },
  },
});

//! Export/Generate Actions
export const { loginAction, logoutAction } = authSlice.actions;

//! Export/Generate Reducers
const authReducer = authSlice.reducer;
export default authReducer;
