import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DogLogo from "../../images/dogLogoCropped.jpg";
import GoogleLogo from "../../images/Google Logo.png";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { SignupSchema } from "../../Formvalidation/registervalidate";
import { useFormik } from "formik";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./register.css";
const Register = () => {
  const [user, setUser] = useState({
    username: "",
    password: "",
    email: "",
    confirmpassword: "",
  });
  const [error, setError] = useState("");
  const [spin, setSpin] = useState(false);

  const navigate = useNavigate();

  const { values, handleBlur, handleChange, handleSubmit, touched, errors } =
    useFormik({
      initialValues: user,
      validationSchema: SignupSchema,
      onSubmit: async (values) => {
        setSpin(true);
        try {
          const res = await fetch("/api/auth/register", {
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: values.username,
              email: values.email,
              password: values.password,
            }),
          });
          const data = await res.json();
          console.log(data);
          if (data.success) {
            setSpin(false);
            toast.success("register successful", {
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
              navigate("/login");
            }, 3000);
          } else {
            setSpin(false);
          }
          if (data.error) {
            setSpin(false);
            setError(res.data.error);
          }
          const userInfo = await res.data;
          console.log(userInfo);
          localStorage.setItem("token", userInfo.accessToken);
          localStorage.setItem("id", userInfo._id);
          Cookies.set("token", userInfo.accessToken, { expires: 5 });
        } catch (err) {
          console.log(err);
        }
      },
    });

  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 35,
        marginTop: "-2rem",
        color: "white",
      }}
      spin
    />
  );

  return (
    <div className="login">
      <ToastContainer />
      {/* <div className="MainLogo">onlineBazaar</div> */}
      <div className="mainWrapper">
        <div className="loginImage">
          <img src={DogLogo} alt="Login" className="LoginMainImage" />
        </div>

        <div className="loginForm" onSubmit={handleSubmit}>
          <form className="loginDetails">
            <div className="topWrapper">
              <div className="welcomeText">Welcome to Joy Of Tails</div>
              <div className="signup">
                <div className="signupText">
                  No Account ?
                  <Link to={"/login"} className="linkColorNone">
                    Sign in
                  </Link>
                </div>
              </div>
            </div>
            <div className="loginText">Sign up</div>
            {error && <div className="wrongCreds">Wrong Credentials</div>}
            <div className="emailPass">
              <div className="email emailPassWrapper">
                <label htmlFor="email " className="emailCss labelTextWrapper">
                  Enter your username
                </label>
                <div className="emailInput">
                  <input
                    type="text"
                    name="username"
                    id="email"
                    placeholder="Username"
                    className="InputCss"
                    value={values.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.username && touched.username && (
                    <p
                      style={{
                        color: "red",
                        textTransform: "lowercase",
                        textAlign: "center",
                      }}
                    >
                      *{errors.username}
                    </p>
                  )}
                </div>
              </div>
              <div className="email emailPassWrapper">
                <label htmlFor="email " className="emailCss labelTextWrapper">
                  Enter your email
                </label>
                <div className="emailInput">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="enter your email"
                    className="InputCss"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.email && touched.email && (
                    <p
                      style={{
                        color: "red",
                        textTransform: "lowercase",
                        textAlign: "center",
                      }}
                    >
                      *{errors.email}
                    </p>
                  )}
                </div>
              </div>
              <div className="password emailPassWrapper">
                <label htmlFor="password" className="passCss labelTextWrapper">
                  Enter your Password
                </label>
                <div className="passInput">
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Password"
                    value={values.password}
                    className="InputCss"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.password && touched.password && (
                    <p
                      style={{
                        color: "red",
                        textTransform: "lowercase",
                        textAlign: "center",
                      }}
                    >
                      *{errors.password}
                    </p>
                  )}
                </div>
              </div>
              <div className="password emailPassWrapper">
                <label htmlFor="password" className="passCss labelTextWrapper">
                  Enter confirm your Password
                </label>
                <div className="passInput">
                  <input
                    type="password"
                    name="confirmpassword"
                    id="password"
                    placeholder="Confirm Password"
                    className="InputCss"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.confirmpassword}
                  />
                  {errors.confirmpassword && touched.confirmpassword && (
                    <p
                      style={{
                        color: "red",
                        textTransform: "lowercase",
                        textAlign: "center",
                      }}
                    >
                      *{errors.confirmpassword}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div style={{ textAlign: "center" }}>
              <button className="loginButton" type="submit">
                <div>{spin ? <Spin indicator={antIcon} /> : "Register"}</div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
