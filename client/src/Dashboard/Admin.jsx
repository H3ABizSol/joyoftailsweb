import React, { useState, useEffect } from "react";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRangePicker } from "react-date-range";
import "./Dashboard.css";
import { Loader } from "../components/Loader/Loader";
import { Dashboardnav } from "../components/Dashboardnav/Dashboardnav";
import {
  MdOutlineProductionQuantityLimits,
  MdBorderColor,
} from "react-icons/md";
import { AiOutlineCustomerService } from "react-icons/ai";

import { SiVirustotal } from "react-icons/si";
import { LiaCompassSolid } from "react-icons/lia";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
} from "recharts";
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";

export const Admin = () => {
  const [count, setCount] = useState({});
  const [allOrder, setOrder] = useState([]);
  const [totalAmount, setTotalAmout] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [completeOrder, setCompleteOrder] = useState("");
  const [spin, setSpin] = useState(false);

  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: "selection",
  };

  const getStats = async () => {
    setSpin(true);
    const { data } = await axios.get("/api/getallstats");
    setCount(data);

    const {
      data: { getOrders },
    } = await axios.get("/api/order", {
      headers: {
        token: localStorage.getItem("token"),
      },
    });
    setOrder(getOrders);
    const filteredOrders = getOrders.filter((ord) => {
      if (ord.status.toLowerCase() == "delevired") {
        return ord;
      }
    });
    let sum = 0;
    filteredOrders.forEach((element) => {
      sum += element.amount;
    });
    setTotalAmout(sum);
    setCompleteOrder(filteredOrders);
    setSpin(false);
  };
  const data = [
    {
      name: "Sales",
      value: completeOrder.length,
    },
    {
      name: "Orders",
      value: count.orderCount,
    },
    {
      name: "Total Revenue",
      value: totalAmount,
    },
    {
      name: "products",
      value: count.productCount,
    },
    {
      name: "customers",
      value: count.userCount,
    },
  ];
  const dateChange = (e) => {
    console.log(e);
    console.log("helo");
    const filteredOrders = allOrder.filter((ord) => {
      if (ord.status == "Complete") {
        console.log(new Date(ord.createdAt).toLocaleDateString());
        if (
          new Date(ord.createdAt).toLocaleDateString() ==
          new Date(e.selection.startDate).toLocaleDateString()
        ) {
          return ord;
        }
        if (
          new Date(ord.createdAt).toLocaleDateString() >=
            new Date(e.selection.startDate).toLocaleDateString() &&
          new Date(ord.createdAt).toLocaleDateString() <=
            new Date(e.selection.endDate).toLocaleDateString()
        ) {
          return ord;
        }
      }
    });
    // console.log(filteredOrders);
    let sum = 0;
    filteredOrders.forEach((element) => {
      sum += element.amount;
    });
    setTotalAmout(sum);
    setCompleteOrder(filteredOrders);

    setStartDate(e.selection.startDate);
    setEndDate(e.selection.endDate);
  };

  useEffect(() => {
    getStats();
  }, []);
  return (
    <section className="dashboard-section">
      <div className="dashboard-wrapper">
        <div className="left-section">
          <Dashboardnav />
        </div>
        {spin ? (
          <Loader />
        ) : (
          <div className="right-section">
            <div className="detail-box">
              <Link to="/dashboard/products">
                <div className="items">
                  <MdOutlineProductionQuantityLimits className="icon" />
                  <h2>{count.productCount} Products</h2>
                </div>
              </Link>
              <Link to="/dashboard/user">
                <div className="items">
                  <AiOutlineCustomerService className="icon" />
                  <h2>{count.userCount} Customer</h2>
                </div>
              </Link>
              <Link to="/dashboard/order">
                <div className="items">
                  <MdBorderColor className="icon" />
                  <h2> {count.orderCount} Orders</h2>
                </div>
              </Link>
              <Link to={`/dashboard/order?name=delevired`}>
                <div className="items">
                  <LiaCompassSolid className="icon" />
                  <h2> {completeOrder.length} completed orders</h2>
                </div>
              </Link>
              <Link to="#">
                <div className="items">
                  <SiVirustotal className="icon" />
                  <h2> ₹ {totalAmount.toFixed(0)} Total</h2>
                </div>
              </Link>
            </div>
            <h2
              style={{
                textAlign: "center",
                fontSize: "1.5rem",
                marginTop: "3rem",
              }}
            >
              Filter By date
            </h2>
            <div className="date-container">
              <DateRangePicker
                ranges={[selectionRange]}
                onChange={dateChange}
                className="myDate"
              />
            </div>
            {/* <div
            className="chart-container"
            // style={{
            //   display: "flex",
            //   justifyContent: "center",
            //   marginTop: "2rem",
            // }}
          >
            <BarChart
              className="chart"
              width={700}
              height={400}
              data={data}
              barSize={40}
              margin={{ top: 2, right: 5, left: 5, bottom: 8 }}
            >
              <Tooltip />
              <XAxis
                dataKey="name"
                scale="point"
                padding={{ left: 10, right: 10 }}
                fontSize={15}
              />
              <YAxis fontSize={18} />
              <Legend />
              <CartesianGrid strokeDasharray="3 3" />
              <Bar
                dataKey="value"
                barSize={35}
                fill="#8884d8"
                background={{ fill: "#eee" }}
              />
            </BarChart>
          </div> */}
          </div>
        )}
      </div>
    </section>
  );
};
