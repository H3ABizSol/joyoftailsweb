import React, { Fragment, useEffect, useState } from "react";
// import { RemoveShoppingCartIcon } from "@mui/icons-material/RemoveShoppingCart";

import { MdRemoveShoppingCart } from "react-icons/md";
import "./Cart.css";
import { Link } from "react-router-dom";
import CartItemCard from "./CartItemCard";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { checkCart, removeCart } from "../../Store/CartSlice/cartslice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "../../";

const Cart = () => {
  const [ok, setOk] = useState(false);
  const [count, setCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [cartItems2, setCartItems2] = useState({});
  const [cart, setCart] = useCart();
  const incQuantity = async (cartId, quan, productId, item) => {
    console.log(item);
    const jwtToken = localStorage.getItem("token");
    const myres = await axios.get(`/api/product/find/${productId}`);
    const filter = cart.map((i) => {
      if (i.productId === productId) {
        return {
          ...i,
          quantity: i.quantity + 1,
        };
      } else {
        return i;
      }
    });

    if (myres.data.productDetails.Stock > quan) {
      setCart([...filter]);
      setCartItems([...filter]);
      const res = await fetch(`/api/cart/${cartId}`, {
        method: "PUT",
        headers: {
          token: jwtToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: localStorage.getItem("id"),
          products: [{ productId: productId, quantity: quan + 1 }],
        }),
      });
      const data = await res.json();
    } else {
      toast.error("Quantity is enough", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        fontSize: "50px",
      });
    }
  };

  const descQuantity = async (cartId, quan, productId) => {
    console.log(quan);
    const jwtToken = localStorage.getItem("token");
    const filter = cart.map((i) => {
      if (i.productId === productId) {
        return {
          ...i,
          quantity: i.quantity - 1,
        };
      } else {
        return i;
      }
    });
    if (quan > 1) {
      setCart([...filter]);
      setCartItems([...filter]);
      const res = await fetch(`/api/cart/${cartId}`, {
        method: "PUT",
        headers: {
          token: jwtToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: localStorage.getItem("id"),
          products: [{ productId: productId, quantity: quan - 1 }],
        }),
      });
      const data = await res.json();
    }
  };
  const CartItemFun = async () => {
    const id = localStorage.getItem("id");
    const jwtToken = localStorage.getItem("token");
    if (jwtToken) {
      const res = await axios.get(`/api/cart/find/${id}`, {
        headers: {
          token: jwtToken,
          "Content-Type": "application/json",
        },
      });
      console.log(res.data);
      if (res.data.success) {
        setCart([...res.data.cart.products]);
        setCartItems2({ ...res.data.cart });
        setCartItems([...res.data.cart.products]);
      }
    }
  };

  useEffect(() => {
    CartItemFun();
  }, []);

  const deleteCartItems = async (cartId, pid, item) => {
    console.log(pid);
    const { data } = await axios.delete(`/api/cart/${cartId}/${pid}`, {
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
    });
    if (data) {
      if (cart.length > 0) {
        const filterCart = cart.filter((c) => {
          console.log(c);
          return c.productId !== pid;
        });
        console.log(filterCart);
        setCart(filterCart);
      }
      toast.success("Product remove from cart", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        fontSize: "50px",
      });
    }
    // setCartItems(data);
    CartItemFun();
  };
  console.log(cartItems2);
  console.log(
    cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0)
  );
  return (
    <Fragment>
      <ToastContainer />
      {cart?.length === 0 ? (
        <div className="emptyCart">
          <MdRemoveShoppingCart className="font" />

          <div className="font">No Product in Your Cart</div>
          <Link to="/products/all" className="font">
            View Products
          </Link>
        </div>
      ) : (
        <Fragment>
          <div className="cartPage">
            <div className="cartHeader">
              <p>Product</p>
              <p>Quantity</p>
              <p>Subtotal</p>
            </div>

            {cart.length > 0 &&
              cart.map((item) => (
                <div className="cartContainer" key={item._id}>
                  <CartItemCard
                    item={item}
                    deleteCartItems={deleteCartItems}
                    cartId={cartItems2._id}
                  />

                  <div className="cartInput">
                    <button
                      onClick={() => {
                        // decreaseQuantity(item.product, item.quantity)
                        descQuantity(
                          cartItems2._id,
                          item.quantity,
                          item.productId
                        );
                        setCount(item.quantity - 1);
                      }}
                    >
                      -
                    </button>
                    <input type="number" value={item.quantity} readOnly />
                    <button
                      onClick={() => {
                        incQuantity(
                          cartItems2._id,
                          item.quantity,
                          item.productId,
                          item
                        );

                        // setCount(count + 1);
                        //     )
                      }}
                    >
                      +
                    </button>
                  </div>
                  <p className="cartSubtotal">{`₹${
                    item.price * item.quantity
                  }`}</p>
                </div>
              ))}

            <div className="cartGrossProfit">
              <div></div>
              <div className="cartGrossProfitBox">
                <p>Gross Total</p>
                <p>{`₹${cartItems?.reduce(
                  (acc, item) => acc + item.quantity * item.price,
                  0
                )}`}</p>
              </div>
              <div></div>
              <Link to={"/shipping"} className="checkOutBtn">
                <button
                // onClick={checkoutHandler}
                >
                  Check Out
                </button>
              </Link>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Cart;
