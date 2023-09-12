import React, { useState } from "react";
import { ProfileLayout } from "../ProfileLayout";
import axios from "axios";
import { Link } from "react-router-dom";

export const Userorder = () => {
  const [order, setOrders] = useState([]);
  const [userProduct, setUserProducts] = useState([]);
  const [user, setUser] = useState({});

  const getOrders = async () => {
    const { data } = await axios.get(
      `/api/order/all/${localStorage.getItem("id")}`,
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    );
    setUser(data);
  };

  const changeStatus = (e, id) => {};

  React.useEffect(() => {
    getOrders();
  }, []);
  return (
    <ProfileLayout>
      {user.length === 0 && (
        <h1 style={{ textAlign: "center", color: "gray", fontSize: "4rem" }}>
          No Orders
        </h1>
      )}
      <div className="order-wrapper">
        {user.length > 0 &&
          user.map((prod, index) => {
            return (
              <div className="order-items">
                {prod.products.map((p) => {
                  return (
                    <Link
                      to={`/orderdetails/${p.productId}`}
                      className="order-items-container"
                    >
                      <div>
                        <img src={`/uploads/${p.img[0]}`} alt="" />
                      </div>
                      <h3>{p.name}</h3>
                      <p>₹ {p.price}</p>
                      <p>{prod.status}</p>
                    </Link>
                  );
                })}
              </div>
            );
          })}
      </div>
    </ProfileLayout>
  );
};
