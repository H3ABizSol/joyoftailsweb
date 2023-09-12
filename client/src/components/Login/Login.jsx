import React, { useState } from "react";
import DogLogo from "../../images/dogLogoCropped.jpg";
import GoogleLogo from "../../images/Google Logo.png";
import { Link, useNavigate } from "react-router-dom";
import compLogo from "../../Asset/logo.png";
import Cookies from "js-cookie";
import "./Login.css";
import { useDispatch } from "react-redux";
import { checkIsAdmin, checkIsUser } from "../../Store/AdminSlice/Adminslice";
import { auth, provider } from "../../firebase.js";
import { signInWithPopup } from "firebase/auth";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Login = () => {
  const [user, setUser] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [spin, setSpin] = useState(false);

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

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogin = async () => {
    setSpin(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: user.username,
          password: user.password,
        }),
      });
      const data = await res.json();
      localStorage.setItem("user", data.username);
      if (data.success) {
        setSpin(false);
        if (data.isAdmin) {
          dispatch(checkIsAdmin(data.isAdmin));
          navigate("/dashboard");
        } else {
          dispatch(checkIsAdmin(false));
          navigate("/");
        }
      } else {
        console.log("jelo");
        setSpin(false);
        toast.error(data.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
      if (data.error) {
        setSpin(false);
        setError(res.data.error);
      }
      const userInfo = await data;
      localStorage.setItem("token", userInfo.accessToken);
      localStorage.setItem("id", userInfo._id);
      localStorage.setItem("isAdmin", userInfo.isAdmin);
      Cookies.set("token", userInfo.accessToken, { expires: 5 });
      dispatch(checkIsUser(true));
    } catch (err) {
      console.log(err.response);
    }
  };
  const handleGoogleFunc = async (data, password) => {
    const data1 = data;
    try {
      const res = await fetch("/api/auth/googleAuth", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: data1,
          password,
        }),
      });
      const data = await res.json();
      if (data) {
        if (data.isAdmin) {
          dispatch(checkIsAdmin(data.isAdmin));
          navigate("/dashboard");
        } else {
          dispatch(checkIsAdmin(false));
          navigate("/");
        }
      } else {
        alert(data.message);
      }
      if (data.error) {
        setError(res.data.error);
      }
      const userInfo = await data;
      localStorage.setItem("token", userInfo.accessToken);
      localStorage.setItem("id", userInfo._id);
      localStorage.setItem("isAdmin", userInfo.isAdmin);
      Cookies.set("token", userInfo.accessToken, { expires: 5 });
      dispatch(checkIsUser(true));
    } catch (err) {
      console.log(err.response);
    }
  };
  const handleGoogleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user1 = result;
        const password = new Date().getTime().toString();
        // setUser({ ...user1, username: user1.email });
        handleGoogleFunc(result, password);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="login">
      <ToastContainer />
      {/* <div className="MainLogo">onlineBazaar</div> */}
      <div className="mainWrapper">
        <div className="loginImage">
          <img src={DogLogo} alt="Login" className="LoginMainImage" />
        </div>

        <div className="loginForm">
          <div className="loginDetails">
            <div className="topWrapper">
              <div className="welcomeText">Welcome to Joy Of Tails</div>
              <div className="signup">
                <div className="signupText">
                  No Account ?{" "}
                  <Link to={"/register"} className="linkColorNone">
                    Sign up
                  </Link>
                </div>
              </div>
            </div>
            <div className="loginText">Sign in</div>
            <div onClick={handleGoogleSignIn} className="loginWithGoogle">
              <div className="loginWithGoogleLink">
                <img
                  src={GoogleLogo}
                  alt="Google Logo"
                  className="loginWithGoogleLink"
                />
              </div>
              <div className="loginWithGoogleText">Sign in with Google</div>
            </div>
            {/* {error && <div className="wrongCreds">Wrong Credentials</div>} */}
            <Link to="/">
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "2rem",
                }}
              >
                <img src={compLogo} alt="" width={40} />
              </div>
            </Link>

            <div className="emailPass">
              <div className="email emailPassWrapper">
                <label htmlFor="email " className="emailCss labelTextWrapper">
                  Enter your username or email address
                </label>
                <div className="emailInput">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Username or email address"
                    className="InputCss"
                    onChange={(e) => {
                      setUser({ ...user, username: e.target.value });
                    }}
                  />
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
                    className="InputCss"
                    onChange={(e) => {
                      setUser({ ...user, password: e.target.value });
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="forgetAndRemember">
              <Link to={"/password/forgot"} className="forgetPass">
                Forgot Password
              </Link>
            </div>
            <div style={{ textAlign: "center" }}>
              <button className="loginButton">
                <div onClick={handleLogin}>
                  {spin ? <Spin indicator={antIcon} /> : "Login"}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
