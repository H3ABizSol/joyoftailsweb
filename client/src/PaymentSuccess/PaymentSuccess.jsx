import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import "./PaymentSuccess.css";
import axios from "axios";
import { height } from "@mui/system";
const PaymentSuccess = () => {
  const seachQuery = useSearchParams()[0];
  const referenceNum = seachQuery.get("reference");
  const [CartItems, setCartItems] = useState([]);
  const CartItemFun = async () => {
    const id = localStorage.getItem("id");
    // console.log(id);
    // const jwtToken = localStorage.getItem("token");
    // const res = await axios.get(`http://localhost:4000/api/cart/find/${id}`, {
    //   headers: {
    //     token: jwtToken,
    //     "Content-Type": "application/json",
    //   },
    // });
    // console.log(res);
    // const deleteCart = await axios.delete(
    //   "http://localhost:4000/api/cart/" + res.data[0]._id,
    //   {
    //     headers: {
    //       token: jwtToken,
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );
    // console.log(res);
    // setCartItems(res.data);
  };

  useEffect(() => {
    CartItemFun();
  }, []);
  return (
    <div className="orderSuccess">
      <img
        src="https://www.svgrepo.com/show/13650/success.svg"
        alt="Payment Successful"
        className="pay-success"
        style={{ height: "100px" }}
      />
      <div>Your Order has been Placed successfully </div>
      <Link to="/userorder">View Orders</Link>
    </div>
  );
};

export default PaymentSuccess;
