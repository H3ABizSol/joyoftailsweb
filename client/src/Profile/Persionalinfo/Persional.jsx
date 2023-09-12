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
  useEffect(() => {
    getUser();
  }, []);
  return (
    <ProfileLayout>
      <div className="profile-content">
        <h2>Persional Information</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta, nobis
          ab error totam deleniti nam odit tempora hic voluptates rem?
          Temporibus illo voluptatibus voluptates eveniet sapiente quidem
          assumenda natus iste.
        </p>
        <ul>
          <li>{user.username}</li>
          <li>{user.email}</li>
        </ul>
      </div>
    </ProfileLayout>
  );
};
