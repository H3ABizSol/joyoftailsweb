import React, { useEffect, useState } from "react";
import "./orderdetail.css";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Popover, Steps } from "antd";
import { GiConfirmed } from "react-icons/gi";
import {
  LoadingOutlined,
  SmileOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";

export const Orderdetails = () => {
  const params = useParams();
  const [orderDetails, setOrderDetails] = useState({});
  const [statusCount, setStatusCount] = useState(0);
  const description = "You can hover on the dot.";
  const customDot = (dot, { status, index }) => (
    <Popover
      content={
        <span>
          step {index} status: {status}
        </span>
      }
    >
      {dot}
    </Popover>
  );

  const getOrderDetails = async () => {
    const { data } = await axios.get(
      `/api/order/oneproductdetails/${params.id}`,
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    );

    // const res = await axios.get(
    //   `https://apiv2.shiprocket.in/v1/external/orders/show/${data?.order_id}`,
    //   {
    //     headers: {
    //       "Content-Type": "application/json",
    //       " Authorization": `Bearer ${localStorage.getItem("shippingToken")}`,
    //     },
    //   }
    // ););
    if (data.status.toLowerCase() === "shipped") {
      setStatusCount(1);
    }
    if (data.status.toLowerCase() === "out for delivery") {
      setStatusCount(2);
    }
    if (data.status.toLowerCase() === "delevired") {
      setStatusCount(3);
    }
    setOrderDetails({
      ...data,
    });
  };

  useEffect(() => {
    getOrderDetails();
  }, []);
  return (
    <div className="order-details-wrapper">
      <div className="order-address">
        <div className="content">
          <h3>Delivery Address</h3>
          <h4>{orderDetails.name}</h4>
          <p>{orderDetails.address}</p>
          <p>Phone Number : {orderDetails.phoneNo}</p>
        </div>
      </div>
      <div>
        <div style={{ width: "60%", margin: "auto", padding: "2rem 0" }}>
          <Steps
            current={statusCount}
            progressDot={customDot}
            items={[
              {
                title: "Order Confirm",
                icon: <UserOutlined size={120} />,
              },
              {
                title: "Order Shipped",
              },
              {
                title: "Out For Delivery",
              },
              {
                title: "Delevired",
              },
            ]}
          />
        </div>
        {orderDetails.products &&
          orderDetails.products.map((p) => {
            return (
              <div className="order-status">
                <div>
                  <img src={`/uploads/${p.img[0]}`} alt="" />
                </div>
                <div>
                  <h4>{p.name}</h4>
                  <p>₹ {p.price}</p>
                  <span style={{ fontSize: "1rem" }}>
                    {" "}
                    {new Date(orderDetails.createdAt).toLocaleDateString()}
                  </span>

                  {orderDetails.status === "delevired" && (
                    <div>
                      <p style={{ fontSize: "1rem" }}>
                        Your item was delevired at{" "}
                        {new Date(orderDetails.updatedAt).toLocaleDateString()}{" "}
                      </p>
                      <p style={{ fontSize: "1rem" }}>
                        {" "}
                        {new Date(orderDetails.updatedAt).toLocaleTimeString()}
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  <h4 style={{ textAlign: "center" }}>
                    {" "}
                    Ouantity : {p.quantity}
                  </h4>
                </div>
                <div>
                  <h4 style={{ textAlign: "center" }}> OID : {p._id}</h4>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
