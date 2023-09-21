import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Modal } from "antd";
import axios from "axios";
import { ProfileLayout } from "../ProfileLayout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Sidenav = ({ user }) => {
  const [userInfo, setUserInfo] = useState({});
  const [formdata, setFormData] = useState({
    name: user.username,
    email: user.email,
    gender: user.gender,
    phone: user.phoneNumber,
    dob: user.dob,
    address: user.address,
  });
  const upload = useRef();

  const getUserInfo = async () => {
    const { data } = await axios.get(
      `/api/user/find/${localStorage.getItem("id")}`,
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    );
    if (data) {
      setUserInfo({ ...data.others });
      setFormData({
        ...formdata,
        username: data.others.username,
        email: data.others.email,
      });
      setImage(data.image);
    }
  };

  const [formdatatwo, setFormDatatwo] = useState({
    oldpassword: "",
    newpassword: "",
  });

  const [image, setImage] = useState("");
  const [ok, setOk] = useState(false);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formdata,
      [e.target.name]: e.target.value,
    });
  };

  const handlePassword = (e) => {
    setFormDatatwo({
      ...formdatatwo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", formdata.username);
    formData.append("email", formdata.email);
    formData.append("address", formdata.address);
    formData.append("phoneNumber", formdata.phone);
    formData.append("dob", formdata.dob);
    formData.append("gender", formdata.gender);

    formData.append("img", image);

    const { data } = await axios.put(
      `/api/user/${localStorage.getItem("id")}`,
      formData,
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    );

    if (data.success) {
      setOk(true);
      setOpen(false);
      setFormData({
        username: "",
        email: "",
        password: "",
      });
      toast.success("Update successfully", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        fontSize: "50px",
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    const { data } = await axios.put(
      `/api/user/${localStorage.getItem("id")}`,
      {
        oldpassword: formdatatwo.oldpassword,
        newpassword: formdatatwo.newpassword,
      },
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    );
    if (data.success) {
      toast.success("Update successfully", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        fontSize: "50px",
      });
    } else {
      toast.success(data.message, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        fontSize: "50px",
      });
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);
  console.log(user);
  return (
    <>
      <Modal
        title="EDIT PROFILE"
        centered
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      >
        <form className="form-wrapper" onSubmit={handleSubmit} method="post">
          <div>
            <input
              type="text"
              name="username"
              placeholder="enter your username"
              onChange={handleChange}
              value={formdata.username}
            />
          </div>
          <div>
            <input
              type="text"
              name="email"
              placeholder="enter your mail"
              onChange={handleChange}
              value={formdata.email}
            />
          </div>
          <div>
            <input
              type="text"
              name="address"
              placeholder="enter your address"
              onChange={handleChange}
              value={formdata.address}
            />
          </div>
          <div>
            <input
              type="text"
              name="phone"
              placeholder="enter your mobile"
              onChange={handleChange}
              value={formdata.phone}
            />
          </div>
          <div>
            <p style={{ marginLeft: "1rem" }}>Date of Birth</p>
            <input
              type="date"
              name="dob"
              placeholder="enter your mail"
              onChange={handleChange}
              value={formdata.dob}
            />
          </div>
          <div className="gender">
            <p>Male</p>
            <input
              type="radio"
              name="gender"
              style={{ padding: "0" }}
              value="male"
              onChange={(e) => {
                setFormData({
                  ...formdata,
                  gender: e.target.value,
                });
              }}
            />
            <p>Female</p>
            <input
              type="radio"
              name="gender"
              value="female"
              onChange={(e) => {
                setFormData({
                  ...formdata,
                  gender: e.target.value,
                });
              }}
            />
          </div>
          <div>
            <input
              type="file"
              multiple
              name="img"
              placeholder="product image"
              onChange={(e) => {
                setImage(e.target.files[0]);
              }}
            />
          </div>
          <div>
            <button className="modal-btn">Submit</button>
          </div>
        </form>
      </Modal>

      <Modal
        title="UPDATE PASSWORD"
        centered
        open={open2}
        onOk={() => setOpen2(false)}
        onCancel={() => setOpen2(false)}
      >
        <form
          className="form-wrapper"
          onSubmit={handlePasswordSubmit}
          method="post"
        >
          <div>
            <input
              type="text"
              name="oldpassword"
              placeholder="enter your old password"
              onChange={handlePassword}
              value={formdatatwo.oldpassword}
            />
          </div>
          <div>
            <input
              type="text"
              name="newpassword"
              placeholder="enter your new password"
              onChange={handlePassword}
              value={formdatatwo.newpassword}
            />
          </div>
          <div>
            <button className="modal-btn">Submit</button>
          </div>
        </form>
      </Modal>
      <div className="side-nav">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <img
            src={`/uploads/${user?.image}`}
            alt=""
            onClick={() => {
              setOpen(true);
            }}
            style={{ cursor: "pointer" }}
          />
          <h2>{user?.username}</h2>
          <p>{user?.email}</p>
        </div>
        <ul>
          <li>
            <Link className="links" to="/profile">
              Persional Info
            </Link>
          </li>
          {/* <li>
            <Link className="links" to="/userorder">
              Billing & Payments
            </Link>
          </li> */}
          <li>
            <Link className="links" to="/userorder">
              Your Orders
            </Link>
          </li>
          <li
            onClick={() => {
              setOpen(true);
            }}
          >
            <Link className="links">Edit Profile</Link>
          </li>
          <li
            onClick={() => {
              setOpen2(true);
            }}
          >
            <Link className="links">Change Password</Link>
          </li>
        </ul>
        <ToastContainer />
      </div>
    </>
  );
};
