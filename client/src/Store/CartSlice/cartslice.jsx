// import { createSlice } from "@reduxjs/toolkit";
// import { steps } from "framer-motion";
// import { useEffect } from "react";
// import { json } from "react-router-dom";
// // let isAdmin;
// // let isUser;

// // if (localStorage.getItem("isAdmin")) {
// //   isAdmin = JSON.parse(localStorage.getItem("isAdmin"));
// // }
// // if (localStorage.getItem("token")) {
// //   isUser = localStorage.getItem("token");
// // }

// const cartSlice = createSlice({
//   name: "cart",
//   initialState: localStorage.getItem("cartItems")
//     ? JSON.parse(localStorage.getItem("cartItems"))
//     : [],
//   reducers: {
//     checkCart(state, action) {
//       const item = action.payload;
//       let itemExist;
//       if (state.length > 0) {
//         itemExist = state.find((i) => {
//           return i._id === item._id;
//         });
//       }
//       if (!itemExist) {
//         state.push(action.payload);
//       }
//     },
//     removeCart(state, action) {
//       const item = action.payload;
//       state.filter((i) => {
//         return i._id !== item.productId;
//       });
//     },
//   },
// });

// export const { checkCart, removeCart } = cartSlice.actions;

// export default cartSlice.reducer;
