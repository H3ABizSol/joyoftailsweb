import React, { useEffect, useState } from "react";
import "./Order.css";
import { Dashboardnav } from "../components/Dashboardnav/Dashboardnav";
import { Loader } from "../components/Loader/Loader";
import axios from "axios";
import { Card } from "antd";
import { AiOutlineDelete } from "react-icons/ai";
const { Meta } = Card;

export const Service = () => {
  const [image, setImage] = useState("");
  const [service, setService] = useState("");
  const [spin, setSpin] = useState(false);
  const [ok, setOk] = useState(false);

  const [userInfo, setUserInfo] = useState({
    title: "",
    address: "",
    mobile: "",
  });

  const handleChange = (e) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    setSpin(true);
    e.preventDefault();
    const formData = new FormData();
    formData.append("img", image);
    formData.append("title", userInfo.title.toLocaleLowerCase());
    formData.append("address", userInfo.address);
    formData.append("mobile", userInfo.mobile);

    const { data } = await axios.post("/api/service", formData, {
      headers: {
        token: localStorage.getItem("token"),
      },
    });
    setSpin(false);
    setOk(true);
  };

  const getService = async () => {
    setSpin(true);
    const { data } = await axios.get("/api/service", {
      headers: {
        token: localStorage.getItem("token"),
      },
    });
    setService([...data.details]);
    setSpin(false);
  };

  const deleteService = async (id) => {
    setSpin(true);
    const { data } = await axios.delete(`/api/service/delete/${id}`, {
      headers: {
        token: localStorage.getItem("token"),
      },
    });
    if (data.success) {
      setSpin(false);
      setOk(true);
    }
  };

  useEffect(() => {
    getService();
  }, []);

  if (ok) {
    return <Service />;
  }

  return (
    <section className="dashboard-section">
      <div className="dashboard-wrapper">
        <div className="left-section">
          <Dashboardnav />
        </div>
        {spin ? (
          <Loader />
        ) : (
          <div className="right-section">
            <div className="form-container">
              <form
                className="form-wrapper"
                onSubmit={handleSubmit}
                method="post"
              >
                <div className="form-content">
                  <input
                    type="text"
                    name="title"
                    value={userInfo.title}
                    placeholder="product title"
                    style={{ padding: "2rem 2rem" }}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="address"
                    placeholder="address"
                    style={{ padding: "2rem 2rem" }}
                    onChange={handleChange}
                    value={userInfo.address}
                  />
                </div>
                <input
                  type="number"
                  name="mobile"
                  placeholder="contact"
                  style={{ padding: "2rem 2rem" }}
                  value={userInfo.mobile}
                  onChange={handleChange}
                />
                <div>
                  <input
                    type="file"
                    multiple
                    name="img"
                    placeholder="product image"
                    style={{ height: "6rem" }}
                    onChange={(e) => {
                      setImage(e.target.files[0]);
                    }}
                  />
                </div>

                {/* <div className="form-content">
                <input
                  type="text"
                  name="categories"
                  placeholder="product categories"
                  rows={8}
                />
                <input type="text" name="animalType" placeholder="animaltype" />
                <input type="text" name="color" placeholder="product color" />
              </div> */}

                {/* <div>
                <textarea
                  type="text"
                  name="desc"
                  placeholder="product description"
                  rows={8}
                />
              </div> */}
                {/* <div className="form-content">
                <input
                  type="text"
                  name="gramPerQuantity"
                  placeholder="gramperquantity"
                />
                <input type="text" name="foodType" placeholder="food type" />
                <input type="text" name="stock" placeholder="product stock" />
              </div> */}

                <div>
                  <button className="modal-btn">Submit</button>
                </div>
              </form>
            </div>

            <div className="service">
              <div className="service-wrapper">
                {service.length > 0 &&
                  service.map((e) => {
                    return (
                      <Card
                        hoverable
                        style={{
                          width: 240,
                        }}
                        cover={
                          <img alt="example" src={`/uploads/${e.image}`} />
                        }
                      >
                        <Meta title={e.title} description={e.address} />
                        <p>Contact : {e.mobile}</p>
                        <div>
                          <AiOutlineDelete
                            size={18}
                            onClick={() => {
                              deleteService(e._id);
                            }}
                          />
                        </div>
                      </Card>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
