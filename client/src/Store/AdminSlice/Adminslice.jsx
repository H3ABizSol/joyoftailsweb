import { createSlice } from "@reduxjs/toolkit";
import { steps } from "framer-motion";
import { useEffect } from "react";
let isAdmin;
let isUser;

if (localStorage.getItem("isAdmin")) {
  isAdmin = localStorage.getItem("isAdmin");
}
if (localStorage.getItem("token")) {
  isUser = localStorage.getItem("token");
}

const AdminSlice = createSlice({
  name: "admin",
  initialState: {
    isAdmin: isAdmin,
    isUser: isUser,
  },
  reducers: {
    checkIsAdmin(state, action) {
      return {
        ...state,
        isAdmin: action.payload,
      };
    },
    checkIsUser(state, action) {
      return {
        ...state,
        isUser: action.payload,
      };
    },
  },
});

export const { checkIsAdmin, checkIsUser } = AdminSlice.actions;

export default AdminSlice.reducer;
