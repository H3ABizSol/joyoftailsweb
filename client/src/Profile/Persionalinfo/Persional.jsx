import React, { useState, useEffect } from "react";
import { ProfileLayout } from "../ProfileLayout";
import axios from "axios";

export const Persional = () => {
  const [user, setUser] = useState({});
  const getUser = async () => {
    const { data } = await axios.get(
      `/api/user/find/${localStorage.getItem("id")}`,
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    );
    setUser({ ...data.others });
  };
  console.log(user);
  useEffect(() => {
    getUser();
  }, []);
  return (
    <ProfileLayout>
      <div className="profile-content">
        <h2>Persional Information</h2>
        <p></p>
        <ul>
          <li> {user.username}</li>
          <li>{user.email}</li>
        </ul>
        <p>Mobile :{user.phoneNumber}</p>
        <p>Address :{user.address}</p>
        <p>Gender :{user.gender}</p>
        <p>DOB :{user.dob}</p>
      </div>
    </ProfileLayout>
  );
};
