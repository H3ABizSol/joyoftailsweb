import React, { useEffect, useState } from "react";
import "./Order.css";
import ReactPaginate from "react-paginate";
import { Dashboardnav } from "../components/Dashboardnav/Dashboardnav";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { Loader } from "../components/Loader/Loader";

export const Order = () => {
  const [order, setOrders] = useState([]);
  const [query] = useSearchParams();
  const [pageCount, setPageCount] = useState("");
  const [keyword, setKeyword] = useState("");
  const [isOrder, setIsOrder] = useState(true);
  const [isFilterOrder, setIsFilterOrder] = useState(false);
  const [filterOrder, setFilterOrder] = useState([]);
  const [spin, setSpin] = useState(false);

  const getOrders = async () => {
    setSpin(true);
    const { data } = await axios.get("/api/order?limit=20", {
      headers: {
        token: localStorage.getItem("token"),
      },
    });

    const filteredOrders = data.getOrders.filter((ord) => {
      if (query.get("name")) {
        if (ord.status.toLowerCase() === "delevired") {
          setIsFilterOrder(true);
          setIsOrder(false);
          return ord;
        }
      } else {
        return ord;
      }
    });
    setOrders(filteredOrders);
    setFilterOrder(filteredOrders);
    setPageCount(data.pageCount);
    setSpin(false);
  };

  const changeStatus = async (e, orderId) => {
    console.log(e.target.value);
    const res = await axios.put(
      "/api/order/" + orderId,
      {
        status: e.target.value,
        // time: new Date().toLocaleTimeString(),
        // date: new Date().toLocaleDateString(),
      },
      {
        headers: {
          token: localStorage.getItem("token"),
          "content-type": "application/json",
        },
      }
    );
    getOrders();
  };

  const changePage = async ({ selected }) => {
    console.log(selected);
    const { data } = await axios.get(
      `/api/order?page=${selected + 1}&limit=${2}`,
      {
        headers: {
          token: localStorage.getItem("token"),
          "content-type": "application/json",
        },
      }
    );
    setOrders(data.getOrders);
  };

  const search = () => {
    const filterData = order.filter((item) => {
      if (item._id.toLowerCase().includes(keyword.toLowerCase())) {
        setIsFilterOrder(true);
        setIsOrder(false);
        return item;
      }
      if (item.name.toLowerCase().includes(keyword.toLowerCase())) {
        setIsFilterOrder(true);
        setIsOrder(false);
        return item;
      }
      if (item.status.toLowerCase().includes(keyword.toLowerCase())) {
        setIsFilterOrder(true);
        setIsOrder(false);
        return item;
      }
    });
    setFilterOrder(filterData);
  };

  useEffect(() => {
    getOrders();
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
            <input
              style={{ marginTop: "2rem", marginLeft: "2rem" }}
              type="search"
              name="search"
              placeholder="search orders"
              onChange={(e) => {
                setKeyword(e.target.value);
              }}
              onKeyUp={search}
            />
            <div className="ord-container">
              <div className="ord-wrapper">
                <div className="grid-ord">
                  <p>OID</p>
                  <p>Name</p>
                  <p>Products</p>
                  <p>Phone</p>
                  <p>Address</p>
                  <p>Status</p>
                  <p>Total Price</p>
                  <p>Date</p>
                  <p>Action</p>
                </div>
                {order.length > 0 &&
                  isOrder &&
                  order.map((o) => {
                    return (
                      <div className="grid-ord">
                        <p>{o._id}</p>
                        <p>{o.name}</p>
                        <div className="prod">
                          {o.products.map((e) => {
                            return (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <div>
                                  <p>₹ {e.price}</p>
                                </div>
                                <img src={`/uploads/${e.img[0]}`} alt="" />
                              </div>
                            );
                          })}
                        </div>
                        <p>{o.phoneNo}</p>
                        <p>{o.address}</p>
                        <div className="status">
                          <p>{o.status}</p>
                        </div>
                        <p>₹ {o.amount}</p>
                        <div>
                          <p> {new Date(o.createdAt).toLocaleDateString()}</p>
                        </div>
                        <select
                          name="status"
                          id="status"
                          onChange={(e) => {
                            changeStatus(e, o._id);
                          }}
                          value={o.status}
                        >
                          <option value="confirm">Confirm</option>
                          <option value="shipped">Shipped</option>
                          <option value="out for delivery">
                            Out For Delivery
                          </option>
                          <option value="delevired">Delevired</option>
                        </select>
                      </div>
                    );
                  })}

                {filterOrder.length > 0 &&
                  isFilterOrder &&
                  filterOrder.map((o) => {
                    return (
                      <div className="grid-ord">
                        <p>{o._id}</p>
                        <p>{o.name}</p>
                        <div className="prod">
                          {o.products.map((e) => {
                            return (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <div>
                                  <p>₹ {e.price}</p>
                                </div>
                                <img src={`/uploads/${e.img[0]}`} alt="" />
                              </div>
                            );
                          })}
                        </div>
                        <p>{o.phoneNo}</p>
                        <p>{o.address}</p>
                        <div className="status">
                          <p>{o.status}</p>
                        </div>
                        <p>₹{o.amount}</p>
                        <div>
                          <p> {new Date(o.createdAt).toLocaleDateString()}</p>
                        </div>

                        <select
                          name="status"
                          id="status"
                          onChange={(e) => {
                            changeStatus(e, o._id);
                          }}
                          value={o.status}
                        >
                          <option value="confirm">Confirm</option>
                          <option value="shipped">Shipped</option>
                          <option value="out for delivery">
                            Out For Delivery
                          </option>
                          <option value="delevired">Delevired</option>
                        </select>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "4rem",
              }}
            >
              <ReactPaginate
                breakLabel="..."
                nextLabel="next >"
                onPageChange={changePage}
                pageRangeDisplayed={pageCount}
                containerClassName="pagination"
                pageLinkClassName="page-num"
                activeClassName="active"
                pageCount={pageCount}
                marginPagesDisplayed={2}
                previousLabel="< previous"
                renderOnZeroPageCount={null}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
