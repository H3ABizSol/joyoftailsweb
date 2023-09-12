import React, { useEffect, useState } from "react";
import "./Order.css";
import { Dashboardnav } from "../components/Dashboardnav/Dashboardnav";
import axios from "axios";
import { Loader } from "../components/Loader/Loader";

export const Coupon = () => {
  const [title, setTitle] = useState("");
  const [offer, setOffer] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [ok, setOk] = useState(false);
  const [spin, setSpin] = useState(false);

  const handleSubmit = async (e) => {
    setSpin(true);
    e.preventDefault();
    const { data } = await axios.post(
      "/api/coupon/create",
      { title, offer },
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    );
    if (data.success) {
      setOk(true);

      setSpin(false);
    }
  };
  const getCoupon = async () => {
    setSpin(true);
    const { data } = await axios.get("/api/coupon", {
      headers: {
        token: localStorage.getItem("token"),
      },
    });
    console.log(data);
    if (data.success) {
      setCoupon({ ...data.coupon });
      setTitle(data.coupon.title);
      setOffer(data.coupon.offer);
      setSpin(false);
    }
  };

  const deleteCoupon = async (e) => {
    const confirm = window.confirm("Are you sure");
    if (confirm) {
      const { data } = await axios.delete(`/api/coupon/delete`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      if (data.success) {
        setOk(true);
      }
    }
  };

  useEffect(() => {
    getCoupon();
  }, []);
  if (ok) {
    return <Coupon />;
  }

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
            <div className="form-container">
              <form
                className="form-wrapper"
                onSubmit={handleSubmit}
                method="post"
              >
                <div className="form-content">
                  <input
                    type="text"
                    name="title"
                    value={title}
                    placeholder="title"
                    style={{ padding: "2rem 2rem" }}
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                  />
                  <input
                    type="text"
                    name="title"
                    value={offer}
                    placeholder="offer %"
                    style={{ padding: "2rem 2rem" }}
                    onChange={(e) => {
                      setOffer(e.target.value);
                    }}
                  />
                  <div>
                    <button className="modal-btn">Create</button>
                  </div>
                </div>
              </form>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "2rem",
              }}
            >
              {coupon && (
                <button
                  className="modal-btn"
                  onClick={() => {
                    deleteCoupon();
                  }}
                >
                  Delete
                </button>
              )}
            </div>
            {coupon && (
              <div className="discount">
                <div className="discount-item">
                  <h2>{coupon?.offer}%</h2>
                  <h3>
                    <span>Offer</span>
                  </h3>
                </div>

                <div className="discount-content">
                  <h2>{coupon?.title}</h2>
                  <button>Shop Now</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
