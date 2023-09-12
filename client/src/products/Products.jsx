import React, { useEffect, useState } from "react";
import axios from "axios";
import "./product.css";
import { useSelector, useDispatch } from "react-redux";
import { AiFillDownCircle } from "react-icons/ai";
import { Rating } from "react-simple-star-rating";
import { Link, useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import ReactPaginate from "react-paginate";
import { AddShipping } from "../Store/ShipingSlice/ShipingSlice";
import { checkCart } from "../Store/CartSlice/cartslice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "..";
import { Loader } from "../components/Loader/Loader";

export const Products = () => {
  const [filterShow, setFilterShow] = useState(false);
  const [products, setAllProducts] = useState([]);
  const [page, setPage] = useState("");
  const [pageCount, setPageCount] = useState("");
  const [pagenation, setPagination] = useState([]);
  const [products1, setProducts1] = useState([]);
  const [categories, setCategories] = useState([]);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(1000000);
  const [rangeValue, setRangeValue] = useState(0);
  const [spin, setSpin] = useState(false);
  const [brand, setBrand] = useState([]);
  const [isFilter, setIsFilter] = useState(false);
  const [isProduct, setIsProduct] = useState(true);
  const [filterProduct, setFilterProduct] = useState(false);
  // const [starCount, setStarcount] = useState(0);
  const navigate = useNavigate();
  const cartItems = useSelector((state) => {
    return state.Cart;
  });

  const [cart, setCart] = useCart();
  const dispatch = useDispatch();
  const params = useParams();

  const data = useSelector((state) => {
    return state.Shipping;
  });

  const getAllProducts = async () => {
    setSpin(true);
    const { data } = await axios.get(`/api/product?limit=${12}`);
    if (params.name === "all") {
      setAllProducts(data.product);
      setIsProduct(true);
      setSpin(false);
    } else {
      setAllProducts(data.product);
      setIsProduct(false);
      const filter = data.product.filter((prod) => {
        if (
          prod.categories.category
            .toLowerCase()
            .includes(params.name.toLowerCase())
        )
          return prod;
        if (prod.brand.toLowerCase().includes(params.name.toLowerCase()))
          return prod;
        if (
          prod.categories.subCategory
            .toLowerCase()
            .includes(params.name.toLowerCase())
        )
          return prod;
        if (prod.title.toLowerCase().includes(params.name.toLowerCase()))
          return prod;

        if (prod.foodType.toLowerCase().includes(params.name.toLowerCase()))
          return prod;
      });
      setIsFilter(true);
      setFilterProduct([...filter]);
      setSpin(false);
    }
    const newdata = [...new Set(data.product.map((item) => item.brand))];
    setBrand(newdata);
    const newCategory = [
      ...new Set(data.product.map((item) => item.categories.category)),
    ];
    setCategories(newCategory);
    setPageCount(data.pageCount);
    const paginationPage = [];
    for (let i = 1; i <= data.count; i++) {
      paginationPage.push(i);
    }
    setPagination([...paginationPage]);
    setProducts1(data.product);
  };

  const changePage = async ({ selected }) => {
    const { data } = await axios.get(
      `/api/product?page=${selected + 1}&limit=${12}`
    );
    setAllProducts(data.product);
  };
  // export const Products = () => {

  const addCart = async (product) => {
    if (localStorage.getItem("token")) {
      const { data } = await axios.post(
        "/api/cart",
        {
          userId: localStorage.getItem("id"),
          products: [
            {
              productId: product._id,
              quantity: 1,
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
        toast.success("Product added to cart", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          fontSize: "50px",
        });
        if (cart) {
          const itemExist = cart.find((i) => {
            return i.productId === product._id;
          });
          if (!itemExist) {
            setCart([...cart, product]);
          }
        }
      }
    } else {
      toast.error("you have to login", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        fontSize: "50px",
      });
      setTimeout(() => {
        navigate("/loginphone");
      }, 500);
    }
  };
  const getCategories = async function () {
    const { data } = await axios.get("/api/category");
    setCategories(data);
  };
  const filteredProducts = (count) => {
    const filter1 = products1.filter((product) => {
      return product.ratings >= count;
    });
    setIsProduct(false);
    setIsFilter(true);
    setFilterProduct(filter1);
  };

  const rangeFilter = (price) => {
    console.log(price);
    const filter1 = products.filter((product) => {
      if (product.price >= price) {
        setIsProduct(false);
        setIsFilter(true);
        return product;
      }
    });
    console.log(filter1);
    setFilterProduct([...filter1]);
  };

  const rangeFilterClick = () => {
    const filter1 = products.filter((product) => {
      if (product.price >= min && product.price <= max) {
        setIsProduct(false);
        setIsFilter(true);
        return product;
      }
    });
    console.log(filter1);
    setFilterProduct([...filter1]);
  };

  const brandSearch = (title) => {
    setSpin(true);
    const filter = products.filter((prod) => {
      return prod.brand.toLowerCase().includes(title.toLowerCase());
    });
    setFilterProduct([...filter]);
    setIsFilter(true);
    setIsProduct(false);
    setTimeout(() => {
      setSpin(false);
    }, 1000);
  };

  const categorySearch = (title) => {
    const filter = products.filter((prod) => {
      return prod.categories.category
        .toLowerCase()
        .includes(title.toLowerCase());
    });
    setFilterProduct([...filter]);
    setIsFilter(true);
    setIsProduct(false);
  };

  const starChange = (e) => {
    if (e.target.checked) {
      filteredProducts(e.target.value);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    filteredProducts();
  }, []);
  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="product-wrapper">
        <div className="filter-section">
          <div className={filterShow ? `show` : "filter-show"}>
            <h2
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.6rem",
                fontSize: "1.4rem",
              }}
            >
              Filter
              <AiFillDownCircle
                className="show-icon"
                onClick={() => {
                  setFilterShow(!filterShow);
                }}
              />
            </h2>
            <div className="ratings top-space">
              <h2 style={{ fontSize: "1.6rem", textAlign: "left" }}>Rating</h2>
              <div className="star-wrapper">
                <label htmlFor="five-s">
                  <Rating initialValue={5} size={15} readonly />
                  <input
                    type="checkbox"
                    name=""
                    value={5}
                    id="five-s"
                    onChange={(e) => {
                      starChange(e);
                    }}
                  />
                </label>
                <label htmlFor="four-s">
                  <Rating initialValue={4} readonly size={15} />
                  & above
                  <input
                    type="checkbox"
                    name=""
                    value={4}
                    id="four-s"
                    onChange={(e) => {
                      starChange(e);
                    }}
                  />
                </label>
                <label htmlFor="three-s">
                  <Rating initialValue={3} readonly size={15} /> & above
                  <input
                    type="checkbox"
                    name=""
                    value={3}
                    id="three-s"
                    onChange={(e) => {
                      starChange(e);
                    }}
                  />
                </label>
              </div>
            </div>
            <div className="price top-space">
              <h2 style={{ fontSize: "1.6rem" }}>Price</h2>
              <div className="slide-range">
                <input
                  type="range"
                  min={100}
                  max={15000}
                  onChange={(e) => {
                    rangeFilter(e.target.value);
                    setRangeValue(e.target.value);
                  }}
                  defaultValue={0}
                  className="ratings-input"
                />
                <span>₹ {rangeValue}</span>
              </div>
              <div className="btn-wrapper">
                <div>
                  <input
                    type="number"
                    min={0}
                    placeholder="₹ MIN"
                    onChange={(e) => {
                      setMin(e.target.value);
                    }}
                    className="number-input"
                  />
                  <input
                    type="number"
                    placeholder="₹ MAX"
                    onChange={(e) => {
                      setMax(e.target.value);
                    }}
                    className="number-input inp"
                  />
                </div>
                <button onClick={rangeFilterClick} className="go-btn">
                  GO
                </button>
              </div>
            </div>
            <div className="categories top-space">
              <h2
                style={{
                  fontSize: "1.6rem",
                  textAlign: "left",
                  marginTop: "2rem",
                }}
              >
                Categories
              </h2>
              <div
                style={{
                  fontSize: "1.3rem",
                  textTransform: "capitalize",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.4rem",
                }}
                className="top-space"
              >
                {categories.map((cat, i) => {
                  return (
                    <p
                      key={i}
                      onClick={() => {
                        categorySearch(cat);
                      }}
                    >
                      {cat}
                    </p>
                  );
                })}
              </div>
              <div>
                <h2
                  style={{
                    fontSize: "1.6rem",
                    textAlign: "left",
                    marginTop: "2rem",
                    marginBottom: "0.6rem",
                  }}
                >
                  Brand
                </h2>
                <p
                  onClick={() => {
                    setIsFilter(false);
                    setIsProduct(true);
                  }}
                >
                  All
                </p>

                <ul className="brand">
                  {brand.length > 0 &&
                    brand.map((prod) => {
                      return (
                        <li
                          onClick={() => {
                            brandSearch(prod);
                          }}
                        >
                          {prod}
                        </li>
                      );
                    })}
                </ul>
              </div>
            </div>
          </div>
        </div>
        {spin ? (
          <Loader />
        ) : (
          <div
            className={
              products && products.length > 0
                ? "product-section"
                : "product-section-two"
            }
          >
            {isProduct &&
              products.length > 0 &&
              products.map((product) => {
                return (
                  <div className="products-section">
                    <div className="products-items">
                      <Link to={`/productsdetails/${product._id}`}>
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
                        Cart
                      </button>
                    </div>
                  </div>
                );
              })}

            {isFilter &&
              filterProduct.length > 0 &&
              filterProduct.map((product) => {
                return (
                  <div className="products-section">
                    <div className="products-items">
                      <Link to={`/productsdetails/${product._id}`}>
                        <figure>
                          <img
                            src={`/uploads/${product.img[0]}`}
                            style={{ width: "100%" }}
                          />
                        </figure>
                        <h2
                          style={{
                            textAlign: "center",
                            fontSize: "1.5rem",
                            width: "100%",
                            height: "20px",
                          }}
                        >
                          {product.title}
                        </h2>
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
                        Cart
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "3rem" }}
      >
        <ReactPaginate
          breakLabel="..."
          nextLabel="next >"
          onPageChange={changePage}
          pageRangeDisplayed={pageCount}
          containerClassName="pagination"
          pageLinkClassName="page-num"
          activeClassName="active"
          pageCount={pageCount}
          marginPagesDisplayed={2}
          previousLabel="< previous"
          renderOnZeroPageCount={null}
        />
      </div>
    </>
  );
};
