import React, { useState } from "react";
import "./Loginphone.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Loginphone = () => {
  // const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [otpShow, setOtpShow] = useState(false);
  const [otp, setOtp] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(phone);
    const { data } = await axios.post("/phonelogin", {
      phone,
    });
    if (data.success) {
      setOtpShow(true);
    }
  };
  const sendOtp = async () => {
    const { data } = await axios.post("/phonelogin/verify", {
      otp,
      phone,
    });
    if (data.success) {
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("id", data.user._id);

      navigate("/");
    }
  };
  return (
    <div className="phone-form-container">
      <div className="phone-form">
        <form action="" onSubmit={handleSubmit}>
          {otpShow ? (
            <div
              className="otp"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <input
                type="number"
                value={otp}
                id=""
                placeholder="enter your otp"
                onChange={(e) => {
                  setOtp(e.target.value);
                }}
              />
              <button type="button" onClick={sendOtp}>
                verify
              </button>
            </div>
          ) : (
            <div className="phone">
              <h2>Enter your Phone Number</h2>
              <input
                type="number"
                name=""
                id=""
                required
                placeholder="Mobile"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                }}
              />
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button>Send OTP</button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
