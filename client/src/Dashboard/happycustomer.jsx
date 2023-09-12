import React, { useEffect, useState } from "react";
import "./Order.css";
import { Dashboardnav } from "../components/Dashboardnav/Dashboardnav";
import axios from "axios";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { Modal } from "antd";
import { Loader } from "../components/Loader/Loader";
import { Rating } from "react-simple-star-rating";

export const HappyCustomer = () => {
  const [ratingProduct, setRatingProducts] = useState([]);
  const [image, setImage] = useState([]);
  const [actionval, setActionVal] = useState([]);
  const [customerImg, setCustomerImg] = useState([]);

  const getAllProducts = async () => {
    // setSpin(true);
    const { data } = await axios.get(`/api/product?limit=${12}`);
    const filterRating = data.product.filter((p) => {
      return p.ratings >= 4;
    });

    setRatingProducts([...filterRating]);
  };
  const getDetails = async () => {
    const { data } = await axios.get("/api/happycustomer", {
      headers: {
        token: localStorage.getItem("token"),
        "content-type": "application/json",
      },
    });
    if (data.success) {
      console.log(data.details);
      setActionVal([...data?.details.happyCustomer]);
      localStorage.setItem("happycustomerId", data.details?._id);
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

  const selectHandle = async (i, e) => {
    console.log(e.target.value);
    if (e.target.value === "1") {
      const { data } = await axios.post(
        "/api/happycustomer",
        {
          details: i,
          select: e.target.value,
          happycustomerid: localStorage.getItem("happycustomerId"),
        },
        {
          headers: {
            token: localStorage.getItem("token"),
            "content-type": "application/json",
          },
        }
      );
    }
    if (e.target.value === "2") {
      console.log(i);
      const { data } = await axios.delete("/api/happycustomer/delete", {
        headers: {
          token: localStorage.getItem("token"),
          "content-type": "application/json",
        },
        data: {
          details: i,
          // select: e.target.value,
          // happycustomerid: localStorage.getItem("happycustomerId"),
        },
      });
    }
  };

  const upload = async () => {
    const formData = new FormData();
    for (const items of image) {
      formData.append("img", items);
    }
    formData.append("customerimgId", localStorage.getItem("customerImgId"));
    formData.append("name", "sushil");
    const { data } = await axios.post("/api/happycustomer/upload", formData, {
      headers: {
        token: localStorage.getItem("token"),
      },
    });
    if (data.success) {
      localStorage.setItem("customerImgId", data.details._id);
    }
  };

  const deleteCustomerImg = async (n) => {
    const { data } = await axios.delete("/api/happycustomer/delete/image", {
      headers: {
        token: localStorage.getItem("token"),
      },
      data: {
        details: n,
      },
    });
  };

  useEffect(() => {
    getAllProducts();
    getDetails();
    getImgDetails();
  }, []);
  return (
    <section className="dashboard-section">
      <div className="dashboard-wrapper">
        <div className="left-section">
          <Dashboardnav />
        </div>

        <div className="right-section">
          <div className="form-container">
            <form
              className="form-wrapper"
              //   onSubmit={handleSubmit}
              method="post"
            >
              <div className="form-content">
                <input
                  type="file"
                  name="title"
                  multiple
                  style={{ padding: "2rem 2rem" }}
                  onChange={(e) => {
                    setImage(e.target.files);
                  }}
                />

                <div>
                  <button type="button" className="modal-btn" onClick={upload}>
                    Upload
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div className="customer-Img">
            {customerImg &&
              customerImg.map((n) => {
                return (
                  <div>
                    <figure>
                      <img src={`/uploads/${n}`} alt="" width={80} />
                    </figure>
                    <div>
                      <AiOutlineDelete
                        size={15}
                        color="red"
                        style={{
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          deleteCustomerImg(n);
                        }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>

          <div className="rating-products-wrapper">
            <div className="grid-rating-products">
              <div>
                <p>Sr No</p>
              </div>
              <p>NAMES</p>
              <p>RATINGS</p>
              <p>COMMENTS</p>
              <p>TOTAL RATING</p>
              <p>ACTIONS</p>
            </div>
            {ratingProduct &&
              ratingProduct.map((i, index) => {
                return (
                  <div className="grid-rating-products">
                    <p>{index + 1}</p>
                    <div>
                      {i.reviews.map((n) => {
                        return <p>{n.name}</p>;
                      })}
                    </div>
                    <div>
                      {i.reviews.map((n) => {
                        return (
                          <p>
                            <Rating
                              readonly
                              size={10}
                              initialValue={n.rating}
                            />
                          </p>
                        );
                      })}
                    </div>
                    <div>
                      {i.reviews.map((n) => {
                        return <p>{n.comment}</p>;
                      })}
                    </div>
                    <div>
                      <p>
                        <Rating readonly size={10} initialValue={i.ratings} />
                      </p>
                    </div>
                    <div>
                      <select
                        value={actionval[index]?.select}
                        name=""
                        id=""
                        onChange={(e) => {
                          selectHandle(i, e, index);
                        }}
                      >
                        <option value="">Choose</option>
                        <option value="1" disabled={actionval[index]?.select}>
                          selected
                        </option>
                        <option
                          value="2"
                          disabled={actionval[index]?.select !== "1"}
                        >
                          Unselected
                        </option>
                      </select>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </section>
  );
};
