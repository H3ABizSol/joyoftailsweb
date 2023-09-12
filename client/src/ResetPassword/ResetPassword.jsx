import React, { useState } from "react";
import "./ResetPassword.css";
import axios from "axios";
import { useParams } from "react-router-dom";
const ResetPassword = () => {
  const { token } = useParams();
  const resetPasswordSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.put("/api/user/password/reset/" + token, {
      password,
      confirmPassword,
    });
    console.log(res.data);
  };
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  return (
    <div>
      <div className="resetPasswordContainer">
        <div className="resetPasswordBox">
          <h2 className="resetPasswordHeading">Update Profile</h2>

          <form className="resetPasswordForm" onSubmit={resetPasswordSubmit}>
            <div>
              {/* <LockOpenIcon /> */}
              <input
                type="password"
                placeholder="New Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="loginPassword">
              {/* <LockIcon /> */}
              <input
                type="password"
                placeholder="Confirm Password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <input type="submit" value="Update" className="resetPasswordBtn" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
