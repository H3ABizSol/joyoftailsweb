import React, { Fragment, useState, useEffect } from "react";
import { Spin } from "antd";
import { Collapse, Divider } from "antd";
// import { useSelector } from "react-redux";
// import MetaData from "../layout/MetaData";
import "./ConfirmOrder.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux/es/hooks/useSelector";

// import { Typography } from "@material-ui/core";

const ConfirmOrder = ({ history }) => {
  const [shippingToken, setShippingToken] = useState();
  const [showButton, setShowBuy] = useState(false);
  const [spin, setSpin] = useState(false);
  const data = useSelector((state) => {
    return state.Shipping;
  });

  //   const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  //   const { user } = useSelector((state) => state.user);
  const [shippingInfo, setShippingInfo] = useState({
    phoneNo: data.phoneNo,
    address: data.address,
    city: data.city,
    state: data.state,
    country: "India",
    pinCode: data.pinCode,
    landmark: data.landmark,
  });
  // const [user, setUser] = useState({ name: localStorage.getItem("user") });
  const [cartItems, setCartItems] = useState({
    products: [
      {
        name: "product 1",
        img: [
          "https://cdn.shopify.com/s/files/1/0565/8021/0861/files/Frame_10976_1600x.png?v=1685180179",
        ],
        quantity: 100,
        price: 6000,
      },
    ],
  });
  const getShippingAuth = async () => {
    const { data } = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/auth/login",
      {
        email: "sushilkhadka.sk33@gmail.com",
        password: "Shiprocket12526688",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("chala hai");
    console.log(data.token);
    setShippingToken(data.token);
    localStorage.setItem("shippingToken", data.token);
  };

  const cashondelivey = async (total) => {
    setSpin(true);
    const res = await axios.post("/api/order", {
      name: data.name,
      email: shippingInfo.email,
      phoneNo: shippingInfo.phoneNo,
      amount: Number(total),
      address,
      products: cartItems.products,
      userId: cartItems.userId,
      paymentmethod: "COD",
    });
    // const { data } = await axios.get(
    //   "https://apiv2.shiprocket.in/v1/external/channels",
    //   {
    //     headers: {
    //       "Content-Type": "application/json",
    //       " Authorization": `Bearer ${shippingToken}`,
    //     },
    //   }
    // );
    // console.log(data.data[0]);
    const prodArr = [];
    res.data.products.map((e) => {
      console.log(e);
      const ob = {
        name: e.name,
        sku: e.productId,
        units: e.quantity,
        selling_price: e.price,
        discount: "",
        tax: "",
      };
      prodArr.push(ob);
    });
    const myres = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
      {
        order_id: res.data._id,
        order_date: "2023-08-23 11:11",
        pickup_location: "Nodia",
        // channel_id: data.id,
        comment: "Reseller: M/s Goku",
        billing_customer_name: localStorage.getItem("user"),
        billing_last_name: "",
        billing_address: shippingInfo.address,
        billing_address_2: shippingInfo.landmark,
        billing_city: shippingInfo.city,
        billing_pincode: shippingInfo.pinCode,
        billing_state: shippingInfo.state,
        billing_country: shippingInfo.country,
        billing_email: shippingInfo.email,
        billing_phone: shippingInfo.phoneNo,
        shipping_is_billing: true,
        shipping_customer_name: "",
        shipping_last_name: "",
        shipping_address: shippingInfo.name,
        shipping_address_2: shippingInfo.landmark,
        shipping_city: shippingInfo.city,
        shipping_pincode: shippingInfo.pinCode,
        shipping_country: shippingInfo.country,
        shipping_state: shippingInfo.state,
        shipping_email: shippingInfo.email,
        shipping_phone: shippingInfo.phoneNo,
        order_items: [...prodArr],
        payment_method: res.data.paymentmethod,
        shipping_charges: 0,
        giftwrap_charges: 0,
        transaction_charges: 0,
        total_discount: 0,
        sub_total: res.data.amount,
        length: 10,
        breadth: 15,
        height: 20,
        weight: 2.5,
      },
      {
        headers: {
          "Content-Type": "application/json",
          " Authorization": `Bearer ${shippingToken}`,
        },
      }
    );
    console.log(myres);
    await axios.put(`/api/order/${res.data._id}`, {
      name: data.name,
      email: shippingInfo.email,
      phoneNo: shippingInfo.phoneNo,
      amount: Number(total),
      address: shippingInfo.address,
      products: cartItems.products,
      userId: cartItems.userId,
      paymentmethod: "COD",
      order_id: myres.data.order_id,
    });
    setSpin(false);
    // setTimeout(() => {
    //   window.location.replace(`/paymentsuccess?reference=COD`);
    // }, 2000);
  };

  useEffect(() => {
    const CartItemFun = async () => {
      const id = localStorage.getItem("id");
      console.log(id);
      const jwtToken = localStorage.getItem("token");
      const res = await axios.get(`/api/cart/find/${id}`, {
        headers: {
          token: jwtToken,
          "Content-Type": "application/json",
        },
      });
      setCartItems(res.data.cart);
    };
    CartItemFun();
    getShippingAuth();
  }, []);
  const subtotal = cartItems.products.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const shippingCharges = subtotal > 1000 ? 0 : 80;

  const tax = subtotal * 0.18;

  const totalPrice = subtotal + tax + shippingCharges;

  const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pinCode}, ${shippingInfo.country}`;

  // const proceedToPayment = () => {
  //   const data = {
  //     subtotal,
  //     shippingCharges,
  //     tax,
  //     totalPrice,
  //   };

  //   localStorage.setItem("orderInfo", JSON.stringify(data));

  //   history.push("/process/payment");
  // };
  const checkoutHandler = async (amount) => {
    const {
      data: { key },
    } = await axios.get("/api/razorpay/getkey");

    const {
      data: { order },
    } = await axios.post("/api/razorpay/checkout", {
      amount,
    });

    const options = {
      key,
      amount: order.amount,
      currency: "INR",
      name: "Joy Of Tails",
      description: "Joy Of Tails ,A Eccomerce website",
      image:
        "https://m.media-amazon.com/images/S/al-eu-726f4d26-7fdb/4f1405ea-4f7e-4efd-a44f-f405588725ec._CR0%2C0%2C400%2C400_SX200_.png",
      order_id: order.id,
      // callback_url: `http://localhost:4000/api/razorpay/paymentverification`,
      handler: async function (response) {
        const res = await axios.post("/api/order", {
          // headers: {
          //   token: localStorage.getItem("token"),
          //   "Content-Type": "application/json",
          // },
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          name: data.name,
          email: shippingInfo.email,
          phoneNo: shippingInfo.phoneNo,
          amount: Number(amount),
          address,
          products: cartItems.products,
          userId: cartItems.userId,
        });

        const { data } = await axios.get(
          "https://apiv2.shiprocket.in/v1/external/channels",
          {
            headers: {
              "Content-Type": "application/json",
              " Authorization": `Bearer ${shippingToken}`,
            },
          }
        );

        const prodArr = [];
        cartItems.products.map((e) => {
          const ob = {
            name: e.name,
            sku: Math.random(),
            units: e.quantity,
            selling_price: e.price,
            discount: "",
            tax: "",
            hsn: 441122,
          };
          prodArr.push(ob);
        });

        const myres = await axios.post(
          "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
          {
            order_id: res.data._id,
            order_date: "2023-08-23 11:11",
            pickup_location: "Primary",
            channel_id: data.data[0].id,
            comment: "Reseller: M/s Goku",
            billing_customer_name: localStorage.getItem("user"),
            billing_last_name: "",
            billing_address: shippingInfo.address,
            billing_address_2: shippingInfo.landmark,
            billing_city: shippingInfo.city,
            billing_pincode: shippingInfo.pinCode,
            billing_state: shippingInfo.state,
            billing_country: shippingInfo.country,
            billing_email: shippingInfo.email,
            billing_phone: shippingInfo.phoneNo,
            shipping_is_billing: true,
            shipping_customer_name: "",
            shipping_last_name: "",
            shipping_address: shippingInfo.name,
            shipping_address_2: shippingInfo.landmark,
            shipping_city: shippingInfo.city,
            shipping_pincode: shippingInfo.pinCode,
            shipping_country: shippingInfo.country,
            shipping_state: shippingInfo.state,
            shipping_email: shippingInfo.email,
            shipping_phone: shippingInfo.phoneNo,
            order_items: [...prodArr],
            payment_method: "Prepaid",
            shipping_charges: 0,
            giftwrap_charges: 0,
            transaction_charges: 0,
            total_discount: 0,
            sub_total: res.data.amount,
            length: 10,
            breadth: 15,
            height: 20,
            weight: 2.5,
          },
          {
            headers: {
              "Content-Type": "application/json",
              " Authorization": `Bearer ${shippingToken}`,
            },
          }
        );
        console.log(myres);
        await axios.put(`/api/order/${res.data._id}`, {
          name: data.name,
          email: shippingInfo.email,
          phoneNo: shippingInfo.phoneNo,
          amount: Number(amount),
          address: shippingInfo.address,
          products: cartItems.products,
          userId: cartItems.userId,
          order_id: myres.data.order_id,
        });

        const redirect = await axios.post("/api/razorpay/paymentverification", {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        });
        setTimeout(() => {
          window.location.replace(
            `/paymentsuccess?reference=${response.razorpay_payment_id}`
          );
        }, 1000);
      },
      prefill: {
        name: data.name,
        email: shippingInfo.email,
        contact: `${shippingInfo.phoneNo}`,
        products: cartItems.products,
      },
      notes: {
        address: address,
        name: data.name,
        email: shippingInfo.email,
        phoneNo: shippingInfo.phoneNo,
        amount: shippingInfo.amount,
        products: cartItems.products,
      },
      theme: {
        color: "#FF6347",
      },
    };
    const razor = new window.Razorpay(options);
    razor.open();
  };
  return (
    <Fragment>
      {/* <MetaData title="Confirm Order" /> */}
      <div className="confirmOrderPage">
        <div>
          <div className="confirmshippingArea">
            <div style={{ fontSize: "2rem" }}>Shipping Info</div>
            <div className="confirmshippingAreaBox">
              <div>
                <p>Name:</p>
                <span>
                  {/* {localStorage.getItem("user") && localStorage.getItem("user")} */}
                  {data.name}
                </span>
              </div>
              <div>
                <p>Phone:</p>
                <span>{data.phoneNo}</span>
              </div>
              <div>
                <p>Address:</p>
                <span>{data.address}</span>
              </div>
              <div>
                <p>Landmark:</p>
                <span>{data.landmark}</span>
              </div>
            </div>
          </div>
          <div className="confirmCartItems">
            <div style={{ fontSize: "2rem" }}>Your Cart Items:</div>
            <div className="confirmCartItemsContainer">
              {cartItems &&
                cartItems.products.map((item) => (
                  <div key={item.product}>
                    <img src={`/uploads/` + item.img[0]} alt="Product" />
                    <Link to={`/product/${item.product}`}>
                      {item.name}
                    </Link>{" "}
                    <span>
                      {item.quantity} X ₹{item.price} ={" "}
                      <b>₹{item.price * item.quantity}</b>
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
        {/*  */}
        <div>
          <div className="orderSummary">
            <div className="orderSummaryHeading">Order Summery</div>
            <div>
              <div>
                <p>Subtotal:</p>
                <span>₹{subtotal}</span>
              </div>
              <div>
                <p>Shipping Charges:</p>
                <span>₹{shippingCharges}</span>
              </div>
              <div>
                <p>GST:</p>
                <span>₹{tax}</span>
              </div>
            </div>

            <div className="orderSummaryTotal">
              <p>
                <b>Total:</b>
              </p>
              <span>₹{totalPrice}</span>
            </div>
            <Collapse
              items={[
                {
                  key: "1",
                  label: "Payment Method",
                  children: (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1.2rem",
                      }}
                    >
                      <button
                        style={{
                          padding: "0.5rem 1rem",
                          backgroundColor: "tomato",
                          border: "none",
                          color: "white",
                        }}
                        onClick={() => {
                          checkoutHandler(totalPrice);
                          // proceedToPayment
                        }}
                      >
                        Online Pay
                      </button>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                        }}
                      >
                        <span>COD</span>
                        <input
                          type="radio"
                          name=""
                          id=""
                          onChange={(e) => {
                            if (e.target.checked) {
                              setShowBuy(true);
                            }
                          }}
                        />
                      </div>
                    </div>
                  ),
                },
              ]}
            />
            {showButton && (
              <button
                style={{ marginTop: "1rem" }}
                onClick={() => {
                  cashondelivey(totalPrice);
                }}
              >
                Place Order {spin && <Spin />}
              </button>
            )}
            {/* <button
              onClick={() => {
                checkoutHandler(totalPrice);
                // proceedToPayment
              }}
            >
              Proceed To Payment
            </button>
            <button
              style={{ marginTop: "1rem" }}
              onClick={() => {
                cashondelivey(totalPrice);
              }}
            >
              Cahs on Delivey {spin && <Spin />}
            </button> */}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ConfirmOrder;
