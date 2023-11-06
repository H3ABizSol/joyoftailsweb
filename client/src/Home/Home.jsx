import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";
import { Rating } from "react-simple-star-rating";
import { PiDogFill } from "react-icons/pi";
import { FaCat } from "react-icons/fa";
import { FaArrowCircleDown } from "react-icons/fa";
import { MyCarousel } from "../Carousel/Carousel";
import { IoMdMailOpen } from "react-icons/io";
import { BsTelephoneFill, BsWhatsapp } from "react-icons/bs";
import girl from "../Asset/girl.webp";
import { Link } from "react-router-dom";
import { CustomerCarousel } from "../Carousel/CustomerCarousel";
import { color, motion } from "framer-motion";
import { Loader } from "../components/Loader/Loader";
import { useDispatch } from "react-redux";
import { checkCart } from "../Store/CartSlice/cartslice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "../";

const customerImages = [
  {
    key: "1",
    imgName:
      "https://images.businessnewsdaily.com/app/uploads/2022/04/04082415/Customer_Service_Getty_nortonrsx.jpg",
  },
  {
    key: "2",
    imgName:
      "https://images.businessnewsdaily.com/app/uploads/2022/04/04082415/Customer_Service_Getty_nortonrsx.jpg",
  },
  {
    key: "3",
    imgName:
      "https://images.businessnewsdaily.com/app/uploads/2022/04/04082415/Customer_Service_Getty_nortonrsx.jpg",
  },
];
const icon = [<PiDogFill />, <FaCat />];
export const Home = () => {
  const [products, setAllProducts] = useState([]);
  const [customerDetails, setCustomerDetails] = useState([]);
  const [customerImg, setCustomerImg] = useState([]);
  const [service, setService] = useState([]);
  const [brand, setBrand] = useState([]);
  const [category, setCategory] = useState([]);
  const [featuredImage, setFeaturedImage] = useState([]);
  const [subcategories, setSubCategories] = useState();
  const [topCategoryHeading, setTopCategoryHeading] = useState([]);
  const [cutomer, setCustomer] = useState([]);
  // const dispatch = useDispatch();
  // const [dogFood, setDogFood] = useState([]);
  const [cart, setCart] = useCart();
  const [information, setInformation] = useState(null);
  const [coupon, setCoupon] = useState(null);
  const [spin, setSpin] = useState(false);

  const getAllProducts = async () => {
    setSpin(true);
    const { data } = await axios.get(`/api/product`);
    const res = await axios.get(`/api/service`);
    const newService = [
      ...new Map(
        res.data.details.map((item) => [item["title"], item])
      ).values(),
    ];
    setService(newService);
    setAllProducts(data.product);
    const cutomerReview = data.product.filter((e) => {
      if (e.ratings >= 2) {
        return e;
      }
    });

    setCustomer([...cutomerReview]);
    setSpin(false);
  };

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
            token: localStorage.getItem("token"),
          },
        }
      );
      if (data) {
        const itemExist = cart.find((i) => {
          return i.productId === product._id;
        });
        if (!itemExist) {
          setCart([...cart, product]);
        }
      }
      toast.success("Product added to cart", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        fontSize: "80px",
      });
    } else {
      toast.error("you have to login first", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
    }
  };

  const getFeaturedImage = async () => {
    const { data } = await axios.get("/api/featured");
    if (data) {
      setFeaturedImage(data.img);
    }
  };

  const getInformation = async () => {
    const { data } = await axios.get("/api/information", {});
    if (data.success) {
      setInformation({ ...data.information });
    }
  };
  const getCoupon = async () => {
    const { data } = await axios.get("/api/coupon", {});
    if (data.success) {
      setCoupon({ ...data.coupon });
    }
  };
  const getCategory = async () => {
    const { data } = await axios.get("/api/category", {});
    if (data.success) {
      const url = [];
      data.categories.map((c) => {
        const title = c.title.map((c) => {
          return url.push(c);
        });
      });
      const filterData = url.filter((e) => {
        return e.isPopular.toLowerCase() === "popular";
      });
      setCategory([...filterData]);
    }
  };
  const getBrands = async () => {
    const { data } = await axios.get("/api/brand", {});
    if (data.success) {
      const url = [];
      data.brands.map((b) => {
        b.brand.map((b) => {
          url.push(b);
        });
      });
      const filterData = url.filter((e) => {
        return e.isPopular.toLowerCase() === "popular";
      });

      setBrand([...filterData]);
    }
  };

  const getSubCategory = async () => {
    const { data } = await axios.get("/api/subcategory", {
      headers: {
        token: localStorage.getItem("token"),
      },
    });
    if (data.success) {
      setSubCategories([...data.subcategories]);
    }

    // const treats = data.subcategories.filter((e) => {
    //   return e.animalType.toLowerCase() === "cat";
    // });
    const unique = [
      ...new Set(
        data.subcategories.map((e) => {
          return e.animalType;
        })
      ),
    ];
    setTopCategoryHeading([...unique]);
  };
  const getDetails = async () => {
    const { data } = await axios.get("/api/happycustomer", {
      headers: {
        // token: localStorage.getItem("token"),
        "content-type": "application/json",
      },
    });
    if (data.success) {
      setCustomerDetails([...data?.details.happyCustomer]);
    }
  };
  const getImgDetails = async () => {
    const { data } = await axios.get("/api/happycustomer/getimages", {
      headers: {
        token: localStorage.getItem("token"),
        "content-type": "application/json",
      },
    });
    if (data.success) {
      console.log(data.details);
      setCustomerImg([...data?.details.happyCustomerImage]);
      // localStorage.setItem("happycustomerId", data.details?._id);
    }
  };

  useEffect(() => {
    window.scrollBy(0, 0);
    getAllProducts();
    getFeaturedImage();
    getCategory();
    getSubCategory();
    getInformation();
    getCoupon();
    getBrands();
    getDetails();
    getImgDetails();
  }, []);

  return (
    <>
      <ToastContainer />
      <section className="category-section">
        <ul>
          {topCategoryHeading &&
            topCategoryHeading.map((name, index) => {
              return (
                <li>
                  {icon[index]}
                  {name}
                  <div className="sub-menu">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "8rem",
                      }}
                    >
                      {subcategories &&
                        subcategories.map((e) => {
                          if (e.animalType === name) {
                            return (
                              <div className="anime-cat">
                                <h3 style={{ textTransform: "capitalize" }}>
                                  {e.title}
                                </h3>
                                <ul
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "start",
                                    gap: "1rem",
                                  }}
                                >
                                  {e.subCategories.map((e) => {
                                    return (
                                      <li
                                        style={{
                                          fontSize: "1.6rem",
                                          textTransform: "capitalize",
                                        }}
                                      >
                                        <Link to={`/products/${e}`}>{e}</Link>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            );
                          }
                        })}
                    </div>
                  </div>
                </li>
              );
            })}
        </ul>
      </section>
      <section
        style={{
          width: "95%",
          margin: "auto",
        }}
      >
        <MyCarousel
          images={featuredImage}
          desktop={1}
          dots={false}
          arrow={true}
          mobile={1}
        />
      </section>

      <section>
        <div className="food-category">
          <h2>Popular Categories</h2>

          <div className="food-category-wrapper">
            {category.length > 0 &&
              category.map((e) => {
                return (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 5 }}
                    viewport={{
                      once: true,
                    }}
                    className="category-item"
                  >
                    <Link to={`products/${e.name}`}>
                      <h2>{e.name}</h2>
                      <figure>
                        <img src={`/uploads/${e.img}`} alt="" />
                      </figure>
                    </Link>
                  </motion.div>
                );
              })}
          </div>
        </div>
      </section>

      <section>
        <div className="food-category food-brand">
          <h2>Popular Brands</h2>

          <div className="food-category-wrapper brand-wrapper">
            {brand.length > 0 &&
              brand.map((e) => {
                return (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 2 }}
                    viewport={{
                      once: true,
                    }}
                    className="category-item food-item"
                  >
                    <Link to={`products/${e.name}`}>
                      <h2>{e.name}</h2>
                      <div>
                        <figure>
                          <img src={`/uploads/${e.img}`} alt="" />
                        </figure>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
          </div>
        </div>
      </section>

      {/* <section>
        <div style={{ width: "95%", margin: "auto", marginTop: "2rem" }}>
          <MyCarousel images={images} imageNumber={6} mobileImageNumber={2} />
        </div>
      </section> */}

      <section className="service-area">
        <div className="service-section">
          <motion.figure
            initial={{ x: -50 }}
            whileInView={{ x: 0 }}
            transition={{ duration: 2 }}
            viewport={{
              once: true,
            }}
          >
            <img src={`/uploads/${information?.img}`} alt="girl" />
          </motion.figure>

          <motion.div
            initial={{ x: 100 }}
            whileInView={{ x: 0 }}
            transition={{ duration: 1 }}
            viewport={{
              once: true,
            }}
            className="service-content"
          >
            <h2>{information?.heading}</h2>
            <p>{information?.desc}</p>
            <div className="servicelist">
              {information?.support &&
                information?.support.split(",").map((e) => {
                  return <h3>{e}</h3>;
                })}
            </div>
            <div className="contact-wrappers">
              <div className="common-contact">
                <a href="">
                  <IoMdMailOpen
                    style={{
                      fontSize: "2.5rem",
                    }}
                  />
                </a>
                <div>
                  <p>Email us anytime</p>
                  <a href={information?.email}>{information?.email}</a>
                </div>
              </div>
              <div className="common-contact">
                <a href="">
                  <BsTelephoneFill style={{ fontSize: "2.4rem" }} />
                </a>
                <div>
                  <p>Contact us anytime</p>
                  <a>{information?.mobile}</a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section>
        <div className="icon-wrapper">
          <Link
            to="/products/dog"
            initial={{ y: -100 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 2 }}
          >
            <motion.div
              initial={{ x: -100 }}
              whileInView={{ x: 0 }}
              transition={{ duration: 1 }}
              viewport={{
                once: true,
              }}
            >
              <div className="items"></div>
              <h2
                style={{
                  textAlign: "center",
                  fontSize: "4rem",
                  marginTop: "1rem",
                  fontFamily: "Fredoka",
                }}
              >
                Dogs
              </h2>
            </motion.div>
          </Link>
          <Link to="products/cat">
            <motion.div
              initial={{ x: 100 }}
              whileInView={{ x: 0 }}
              transition={{ duration: 1 }}
              viewport={{
                once: true,
              }}
            >
              <div className="items cat"></div>
              <h2
                style={{
                  textAlign: "center",
                  fontSize: "4rem",
                  marginTop: "1rem",
                  fontFamily: "Fredoka",
                }}
              >
                Cat
              </h2>
            </motion.div>
          </Link>
        </div>
      </section>

      <section>
        {spin ? (
          <Loader />
        ) : (
          <div className="product">
            {products && products.length > 0 ? (
              products.slice(0, 6).map((product) => {
                return (
                  <div className="product-items">
                    <Link to={`/productsdetails/${product._id}`}>
                      <div className="img-container">
                        <figure>
                          <img
                            src={`/uploads/${product.img[0]}`}
                            style={{
                              objectFit: "cover",
                              width: "100%",
                              height: "100%",
                            }}
                          />
                        </figure>
                      </div>
                      <h2>{product.title}</h2>
                    </Link>
                    <div style={{ textAlign: "center", marginTop: "0.4rem" }}>
                      <p>
                        <Rating
                          size={20}
                          readonly
                          fillColor="#FF6347"
                          initialValue={product.ratings}
                        />{" "}
                        || {product.numOfReviews} reviews
                      </p>
                    </div>

                    <p
                      style={{
                        textAlign: "center",
                        fontSize: "1.5rem",
                        marginTop: "0.6rem",
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
                      Add Cart
                    </button>
                  </div>
                );
              })
            ) : (
              <p
                style={{
                  textAlign: "center",
                  fontSize: "5rem",
                  color: "gray",
                  marginTop: "2rem",
                }}
              >
                No Products Avilable
              </p>
            )}
          </div>
        )}
      </section>

      <section>
        <div className="sleeping-dog"></div>
      </section>
      <section>
        <CustomerCarousel
          data={customerDetails}
          customerImages={customerImg}
          dots={true}
          arrows={false}
        />
      </section>

      <section>
        <div className="discount">
          <div className="discount-item">
            <h2>{coupon?.offer}%</h2>
            <h3>
              <span>Offer</span>
            </h3>
          </div>

          <div className="discount-content">
            <h2>{coupon?.title}</h2>
            <button>Shop Now</button>
          </div>
        </div>
      </section>
      <section className="our-service">
        <h2>Our Services</h2>
        <div className="ourservice-section">
          {service.length > 0 &&
            service.map((item) => {
              return (
                <Link to={`/service/${item.title}`}>
                  <div className="service-items">
                    <div>
                      <figure>
                        <img src={`/uploads/${item.image}`} />
                      </figure>
                      <h2 style={{ textTransform: "capitalize" }}>
                        {item.title}
                      </h2>
                    </div>
                  </div>
                </Link>
              );
            })}

          {/* <div className="service-items">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <figure>
                <img src="https://www.hartz.com/wp-content/uploads/2022/03/dog-benefits-health-1.jpg" />
              </figure>
              <h2>Broading</h2>
            </div>
          </div>

          <div className="service-items">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <figure>
                <img src="https://www.hartz.com/wp-content/uploads/2022/03/dog-benefits-health-1.jpg" />
              </figure>
              <h2>Veterinary Care</h2>
            </div>
          </div> */}
        </div>
      </section>
    </>
  );
};

// https://pettie.wpengine.com/wp-content/uploads/2023/05/Pty-Dog-Image-1-overlay.png
