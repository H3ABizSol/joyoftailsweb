import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { motion } from "framer-motion";
import compLogo from "../../Asset/logo.png";
import { BsHeadphones } from "react-icons/bs";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  AiFillMail,
  AiOutlineSearch,
  AiOutlineShoppingCart,
  AiOutlineUser,
  AiOutlineMenu,
  AiOutlineClose,
} from "react-icons/ai";
import "./Header.css";
import { checkIsAdmin } from "../../Store/AdminSlice/Adminslice";
import { useDispatch } from "react-redux";
import axios from "axios";
import { checkCart } from "../../Store/CartSlice/cartslice";

import { useCart } from "../..";

export const Header = () => {
  // const reducer = useR;
  const [menu, setMenu] = useState(true);
  const [show, setShow] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const [keyword, setKeyword] = useState([]);
  const [products, setProducts] = useState([]);
  const [ok, setOk] = useState(false);
  const dispatch = useDispatch();
  const [cart, setCart] = useCart();
  const [isAdmin, setIsAdmin] = useState("");
  const handleClick = () => {
    setMenu(!menu);
  };

  const { isUser } = useSelector((state) => {
    return state.Admin;
  });

  // const data = useSelector((state) => {
  //   return state.Cart;
  // });

  const search = async () => {
    console.log(keyword);
    const filterData = products.filter((item) => {
      if (keyword === "") {
        setShow(false);
        return item;
      }
      if (item.brand.toLowerCase().includes(keyword.toLowerCase())) {
        setShow(true);
        return item;
      }
      if (item.title.toLowerCase().includes(keyword.toLowerCase())) {
        setShow(true);

        return item;
      }
      if (item.desc.toLowerCase().includes(keyword.toLowerCase())) {
        setShow(true);
        return item;
      }
      if (
        item.categories.category.toLowerCase().includes(keyword.toLowerCase())
      ) {
        setShow(true);
        return item;
      }
    });
    setSearchData([...filterData]);
  };

  const getAllProducts = async () => {
    const { data } = await axios.get("/api/product");
    setProducts([...data.product]);
  };

  const getCart = async () => {
    const id = localStorage.getItem("id");
    const jwtToken = localStorage?.getItem("token");
    if (jwtToken) {
      const { data } = await axios.get(`/api/cart/find/${id}`, {
        headers: {
          token: jwtToken,
          "Content-Type": "application/json",
        },
      });

      if (data.cart) {
        localStorage.setItem("cartItems", JSON.stringify(data.cart.products));
        setCart([...data.cart.products]);
      } else {
        setCart([]);
      }
    } else {
      localStorage.setItem("cartItems", JSON.stringify([]));
      setCart([]);
    }
  };

  useEffect(() => {
    setIsAdmin(localStorage.getItem("isAdmin"));
    getAllProducts();
    getCart();
  }, []);
  return (
    <header>
      <div className="contact-wrapper">
        <div>
          <motion.p
            style={{ fontWeight: "bolder" }}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 1 }}
          >
            Get 15% Off When You Spend $800 W. Code: GIFTNEW
          </motion.p>
        </div>
        <motion.div
          className="contact"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 4 }}
        >
          <div className="contact-icons">
            <BsHeadphones className="icons" />
            <a href="">(+00)1234-5678</a>
          </div>
          <div className="contact-icons">
            <AiFillMail className="icons" />
            <a href="">support@example.com</a>
          </div>
          <div className="contact-icons">
            <Link to="/products/all">
              <button style={{ cursor: "pointer" }}>Book Now</button>
            </Link>
          </div>
        </motion.div>
      </div>
      <nav className="nav-bar">
        <div className="left-nav-section">
          <figure>
            <Link to="/">
              <img src={compLogo} alt="" />
            </Link>
          </figure>
        </div>
        <div className="middle-nav-section">
          <form className="nav-bar-search">
            <input
              type="search"
              name=""
              placeholder="search anything for your pets"
              onChange={(e) => {
                setKeyword(e.target.value);
              }}
              onKeyUp={search}
            />
            <div className="search">
              <AiOutlineSearch />
            </div>
          </form>
          <ul className={show ? `searchData show-search` : "searchData"}>
            {searchData.length > 0
              ? searchData.map((item) => {
                  return (
                    <li
                      style={{ fontSize: "1.6rem", color: "gray" }}
                      onClick={() => {
                        setShow(false);
                      }}
                    >
                      <Link to={`/productsdetails/${item._id}`}>
                        {item.brand + " " + item.title}
                      </Link>
                    </li>
                  );
                })
              : ""}
          </ul>
        </div>
        <div className="right-nav-section">
          <div className="nav-icons">
            <ul style={{ display: "flex", gap: "1.2rem" }}>
              <li>
                <NavLink to="/">Home</NavLink>
              </li>
              <li>
                <NavLink to="/allblogs">Blogs</NavLink>
              </li>

              {isAdmin === "true" && (
                <li>
                  <NavLink to="/dashboard">Dashboard</NavLink>
                </li>
              )}
              <li>
                <NavLink to="/products/all">Products</NavLink>
              </li>
            </ul>
            <div className="account">
              <AiOutlineUser className="icons" />
              <div className="sub-menu-account">
                <ul
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "1.8rem",
                  }}
                >
                  {localStorage.getItem("token") ? (
                    <li>
                      <Link to="/profile">My Profile</Link>
                    </li>
                  ) : (
                    <li>
                      <NavLink to="/login">login</NavLink>
                    </li>
                  )}

                  {!localStorage.getItem("token") && (
                    <li>
                      <NavLink to="/register">Register</NavLink>
                    </li>
                  )}
                  {localStorage.getItem("token") && (
                    <li>
                      <Link to="/userorder">My Orders</Link>
                    </li>
                  )}

                  {localStorage.getItem("token") && (
                    <li>
                      <NavLink
                        to="/register"
                        onClick={() => {
                          localStorage.removeItem("token");
                          localStorage.removeItem("id");
                          localStorage.removeItem("user");
                        }}
                      >
                        Logout
                      </NavLink>
                    </li>
                  )}
                </ul>
              </div>
            </div>
            <NavLink to="/cart">
              <div style={{ position: "relative" }}>
                <AiOutlineShoppingCart className="icons" />
                <span
                  style={{
                    position: "absolute",
                    top: "-50%",
                    left: "50%",
                    backgroundColor: "white",
                    width: "15px",
                    height: "15px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "1rem",
                  }}
                >
                  {cart && cart.length}
                </span>
              </div>
            </NavLink>
          </div>
        </div>
        <div className="menu">
          <NavLink to="/cart">
            <div style={{ position: "relative" }}>
              <AiOutlineShoppingCart className="icons" />
              <span
                style={{
                  position: "absolute",
                  top: "-20%",
                  left: "50%",
                  backgroundColor: "white",
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0.8rem",
                  fontSize: "1.2rem",
                }}
              >
                {cart && cart.length}
              </span>
            </div>
          </NavLink>
          <div>
            <AiOutlineMenu onClick={handleClick} />
          </div>
        </div>
        <div
          className={
            menu ? "right-nav-section-mobile" : "right-nav-section-mobile show"
          }
        >
          <div className="menu">
            <AiOutlineClose onClick={handleClick} />
          </div>
          <div className="nav-icons">
            <ul
              style={{
                display: "flex",
                gap: "1.2rem",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <li
                onClick={() => {
                  setMenu(true);
                }}
              >
                <NavLink to="/">Home</NavLink>
              </li>
              <li
                onClick={() => {
                  setMenu(true);
                }}
              >
                Service
              </li>
              <li
                onClick={() => {
                  setMenu(true);
                }}
              >
                <NavLink to="/products/all">Products</NavLink>
              </li>
              {/* <li>
                <NavLink
                  to="/login"
                  onClick={() => {
                    setMenu(true);
                  }}
                >
                  Login
                </NavLink>
              </li> */}
              {isAdmin && (
                <li
                  onClick={() => {
                    setMenu(true);
                  }}
                >
                  <NavLink to="/dashboard">Dashboard</NavLink>
                </li>
              )}

              {localStorage.getItem("token") ? (
                <li
                  onClick={() => {
                    setMenu(true);
                  }}
                >
                  <Link to="/profile">My Profile</Link>
                </li>
              ) : (
                <li
                  onClick={() => {
                    setMenu(true);
                  }}
                >
                  <NavLink to="/login">login</NavLink>
                </li>
              )}

              {!localStorage.getItem("token") && (
                <li
                  onClick={() => {
                    setMenu(true);
                  }}
                >
                  <NavLink to="/register">Register</NavLink>
                </li>
              )}
              {localStorage.getItem("token") && (
                <li>
                  <NavLink
                    to="/register"
                    onClick={() => {
                      localStorage.removeItem("token");
                      // dispatch(false);
                    }}
                  >
                    logout
                  </NavLink>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};
