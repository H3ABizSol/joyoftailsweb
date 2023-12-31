import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export const Privateroute = () => {
  const navigate = useNavigate();
  const [ok, setOk] = useState(false);
  const isAdmin = async () => {
    const { data } = await axios.get("/api/user/isadmin", {
      headers: {
        id: localStorage.getItem("id"),
      },
    });
    console.log(data);
    if (data.success) {
      if (data.user.isAdmin) {
        setOk(true);
      } else {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    isAdmin();
  }, []);
  if (ok) {
    return <Outlet />;
  }
};
