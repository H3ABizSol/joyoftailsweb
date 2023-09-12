import { createSlice } from "@reduxjs/toolkit";

const ShipingSlice = createSlice({
  name: "shiping",
  initialState: {
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
    phoneNo: "",
    landmark: "",
  },
  reducers: {
    AddShipping(state, action) {
      const user = action.payload;
      return user;
    },
  },
});

export const { AddShipping } = ShipingSlice.actions;

export default ShipingSlice.reducer;
