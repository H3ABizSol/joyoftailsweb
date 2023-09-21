import React, { useEffect, useState } from "react";
import { Rating } from "react-simple-star-rating";
import { Link, NavLink, useParams } from "react-router-dom";
import { Modal } from "antd";
import "./index.css";
import axios from "axios";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { checkCart } from "../Store/CartSlice/cartslice";
import { Productreview } from "../Productreview/productreview";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "../";

export const Productdetails = () => {
  const [image, setImage] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [category, setCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(1);
  const [open, setOpen] = useState(false);
  const params = useParams();
  const dispatch = useDispatch();
  const [priceIndex, setPriceIndex] = useState(0);
  const [cart, setCart] = useCart();

  const getAllProducts = async () => {
    const { data } = await axios.get(`/api/product`);
    setAllProducts(data.product);
  };

  const getProducts = async () => {
    const { data } = await axios.get(`/api/product/find/${params.id}`);
    setImage(data.productDetails.img);
    setProducts(data.productDetails);
    setCategory(data.productDetails.categories.category);
    if (data.success) {
      getAllProducts();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (localStorage.getItem("token")) {
      const { data } = await axios.post(
        `/api/product/review/${localStorage.getItem("id")}/${params.id}`,
        {
          user: localStorage.getItem("id"),
          rating,
          comment,
          name: localStorage.getItem("user"),
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      if (data.success) {
        setOpen(false);
      }
    } else {
      toast.error("you have to login first", {
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

  // if (allProducts.length > 0) {
  //   const filterData = allProducts.filter((product) => {
  //     console.log(product.brand.toLowerCase());
  //     return (
  //       product?.brand.toLowerCase() === products?.brand.toLowerCase() &&
  //       product.title !== products.title
  //     );
  //   });
  //   setFilterProducts(filterData);
  // }

  const addCart = async (product) => {
    if (localStorage.getItem("token")) {
      const { data } = await axios.post(
        "/api/cart",
        {
          userId: localStorage.getItem("id"),
          products: [
            {
              productId: product._id,
              quantity: count,
              img: product.img,
              name: product.title,
              price: product.price,
            },
          ],
        },
        {
          headers: {
            token: Cookies.get("token"),
          },
        }
      );

      if (data.success) {
        const itemExist = cart.find((i) => {
          return i.productId === product._id;
        });
        if (!itemExist) {
          setCart([...cart, product]);
        }
        toast.success("Product added to cart", {
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
    } else {
      toast.error("you have to login first", {
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

  const incQuantity = async (cartId, quan, productId) => {
    console.log(quan);
    const jwtToken = localStorage.getItem("token");
    if (quan > count) {
      setCount(count + 1);
      const res = await fetch(`/api/cart/${cartId}`, {
        method: "PUT",
        headers: {
          token: jwtToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: localStorage.getItem("id"),
          products: [{ productId: productId, quantity: count + 1 }],
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
    // setCartItems(data);
    // setOk(true);
  };

  const descQuantity = async (cartId, quan, productId) => {
    const jwtToken = localStorage.getItem("token");
    if (count > 1) {
      setCount(count - 1);
      const res = await fetch(`/api/cart/${cartId}`, {
        method: "PUT",
        headers: {
          token: jwtToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: localStorage.getItem("id"),
          products: [{ productId: productId, quantity: count - 1 }],
        }),
      });
      const data = await res.json();

      // setCartItems(data);
    }
  };
  const handleRating = (number) => {
    setRating(number);
  };
  // const CartItemFun = async () => {
  //   const id = localStorage.getItem("id");
  //   const jwtToken = localStorage.getItem("token");
  //   if (jwtToken) {
  //     const res = await axios.get(`/api/cart/find/${id}`, {
  //       headers: {
  //         token: jwtToken,
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     const filter = res.data.cart.products.filter((i) => {
  //       return i.productId === params.id;
  //     });
  //     if (res.data.success) {
  //       setCount(filter[0].quantity);
  //     }
  //   }
  // };

  useEffect(() => {
    window.scrollTo(0, 0);
    getProducts();
    // CartItemFun();
  }, []);

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Modal
        title="Form"
        centered
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
      >
        <form className="form-wrapper" onSubmit={handleSubmit} method="post">
          <Rating
            size={20}
            initialValue={rating}
            onClick={handleRating}
            allowFraction={true}
          />
          <div>
            <textarea
              name="comment"
              placeholder="comment"
              value={comment}
              rows={5}
              onChange={(e) => {
                setComment(e.target.value);
              }}
            />
          </div>
          <div>
            <button className="modal-btn">Submit Review</button>
          </div>
        </form>
      </Modal>
      <div className="product-details-section">
        <div className="left">
          <div className="left-container">
            <div className="img-preview">
              <img src={`/uploads/${image[index]}`} alt="" />
            </div>
            <div className="arr-img">
              {image.length > 0 &&
                image.map((img, index) => {
                  return (
                    <div
                      className="img-item"
                      onClick={() => {
                        setIndex(index);
                      }}
                    >
                      <img src={`/uploads/${img}`} alt="" />
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        <div className="right">
          <div className="right-wrapper">
            <h2 style={{ fontSize: "2rem" }}>{products && products.title}</h2>
            <p style={{ fontSize: "1rem" }}>
              <Rating
                size={20}
                initialValue={products.ratings}
                readonly
                allowFraction={true}
              />{" "}
              || {products.numOfReviews} customer reviews
            </p>
            <p
              style={{
                fontSize: "1.3rem",
                fontWeight: "550",
                display: "flex",
                alignItems: "center",
                gap: "2.5rem",
              }}
            >
              <span style={{ color: "red", fontSize: "2rem" }}>
                (-{products.discount}) %
              </span>
              <span style={{ color: "green", fontSize: "2.5rem" }}>
                ₹ {products.sellingPrice}
              </span>
              <span>
                MRP : <del>{products.price}</del>
              </span>
            </p>
            <p style={{ fontSize: "1.3rem", fontWeight: "550" }}>
              Brand :{" "}
              <span style={{ fontWeight: "400" }}>{products.brand}</span>
            </p>
            <p
              style={{
                fontSize: "1.3rem",
                fontWeight: "550",
                textTransform: "capitalize",
              }}
            >
              Diet Type :{" "}
              <span style={{ fontWeight: "400" }}>{products.foodType}</span>
            </p>
            <div
              style={{ display: "flex", gap: "1.2rem", alignItems: "center" }}
            >
              <p
                style={{
                  fontSize: "1.4rem",
                  fontWeight: "550",
                  textTransform: "capitalize",
                }}
              >
                Quantity
              </p>
              <div style={{ display: "flex", gap: "0.8rem" }}>
                {products.gramPerQuantity?.map((i, index) => {
                  return (
                    <p
                      style={{
                        border: "1px solid gray",
                        padding: "0.5rem 1rem",
                      }}
                      onClick={() => {
                        setPriceIndex(index);
                      }}
                    >
                      {i.size}
                    </p>
                  );
                })}
              </div>
            </div>
            <p style={{ fontSize: "1.3rem", fontWeight: "550" }}>
              Price: ₹{""}
              {products.gramPerQuantity &&
                parseInt(
                  products.gramPerQuantity[priceIndex].price -
                    (products.gramPerQuantity[priceIndex].price *
                      products.discount) /
                      100
                )}
            </p>
            <p style={{ fontSize: "1.3rem", fontWeight: "550" }}>
              Categories :<span style={{ fontWeight: "500" }}>{category}</span>
            </p>
            <p
              style={{
                fontSize: "1.2rem",
                color: "gray",
                lineHeight: "2.2rem",
              }}
            >
              {products.desc}
            </p>

            <p style={{ fontSize: "1.2rem" }}>Avilabe - in Stock</p>
            <div className="btn-container">
              <div>
                <div
                  className="cartInput"
                  style={{
                    marginLeft: "2rem",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <button
                    onClick={() => {
                      descQuantity(
                        products._id,
                        products.Stock,
                        products.productId
                      );
                    }}
                  >
                    -
                  </button>
                  <input type="number" value={count} readOnly />
                  <button
                    onClick={() => {
                      console.log(products);
                      incQuantity(
                        products._id,
                        products.Stock,
                        products.productId
                      );
                    }}
                  >
                    +
                  </button>
                </div>

                <button
                  className="btn"
                  onClick={() => {
                    addCart(products);
                  }}
                >
                  Add to Cart
                </button>
                <button
                  className="btn"
                  onClick={() => {
                    setOpen(true);
                  }}
                >
                  submit review
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="product-section-second">
        {allProducts.length > 0 &&
          allProducts.map((product) => {
            if (
              product.brand.toLowerCase() === products.brand.toLowerCase() &&
              product.title.toLowerCase() !== products.title.toLowerCase()
            ) {
              return (
                <div className="products-section">
                  <div className="products-items">
                    <Link to={`/products/${product._id}`}>
                      <figure>
                        <img
                          src={`/uploads/${product.img[0]}`}
                          style={{ width: "100%" }}
                        />
                      </figure>
                      <h2>{product.title}</h2>
                      <p
                        style={{
                          textAlign: "center",
                          fontSize: "1.2rem",
                          fontWeight: "600",
                          marginTop: "2rem",
                        }}
                      >
                        Brand : {product.brand}
                      </p>
                    </Link>
                    <div style={{ textAlign: "center", marginTop: "2rem" }}>
                      <p>
                        <Rating
                          size={20}
                          readonly
                          style={{
                            color: "red",
                          }}
                          initialValue={product.ratings}
                        />{" "}
                        || {product.numOfReviews} reviews
                      </p>
                    </div>

                    <p
                      style={{
                        textAlign: "center",
                        fontSize: "1.5rem",
                        marginTop: "1rem",
                        fontWeight: "700",
                        color: "#044B9A",
                      }}
                    >
                      ₹{product.price}
                    </p>
                    <button
                      onClick={() => {
                        addCart(product);
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            }
          })}
      </div>
      <Productreview product={products} />
    </>
  );
};
