import React, { useEffect, useState } from "react";
import "./Order.css";
import { Dashboardnav } from "../components/Dashboardnav/Dashboardnav";
import axios from "axios";
import Modal from "antd/es/modal/Modal";
import { Loader } from "../components/Loader/Loader";

export const Featured = () => {
  const [feature, setFeature] = useState([]);
  const [featureId, setFeatureID] = useState();
  const [index, setIndex] = useState();

  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);

  const [image, setImage] = useState();
  const [image2, setImage2] = useState();
  const [image3, setImage3] = useState();

  const [removeImg, setRemoveImg] = useState();
  const [spin, setSpin] = useState(false);
  const [ok, setOK] = useState(false);

  const getFeatured = async () => {
    setSpin(true);
    const { data } = await axios.get("/api/featured");
    if (data) {
      setFeature([...data.img]);
      setFeatureID(data._id);
      setSpin(false);
    } else {
      setSpin(false);
    }
  };
  useEffect(() => {
    getFeatured();
  }, []);

  const handleSubmit = async (e, id) => {
    setSpin(true);
    e.preventDefault();
    const files = image;
    const formData = new FormData();
    for (const file of files) {
      formData.append("img", file);
    }
    const { data } = await axios.post("/api/featured", formData, {
      headers: {
        token: localStorage.getItem("token"),
      },
    });
    console.log(data);
    if (data.success) {
      setSpin(false);
      setOK(true);
    }
  };

  const handleSubmit2 = async (e, id) => {
    setSpin(true);
    e.preventDefault();
    const formData = new FormData();
    formData.append("img", image2);
    formData.append("index", index);
    formData.append("removeimg", removeImg);
    formData.append("featuredId", featureId);

    const { data } = await axios.put(`/api/featured/${removeImg}`, formData, {
      headers: {
        token: localStorage.getItem("token"),
      },
    });
    if (data.success) {
      setSpin(false);
      setOK(true);
    }
  };

  const handleSubmit3 = async (e, id) => {
    setSpin(true);
    e.preventDefault();
    const files = image3;
    const formData = new FormData();
    formData.append("featuredId", featureId);
    formData.append("img", image3);
    const { data } = await axios.put("/api/featured/addmore", formData, {
      headers: {
        token: localStorage.getItem("token"),
      },
    });
    if (data.success) {
      setSpin(false);
      setOK(true);
    } else {
      alert(data.message);
    }
  };

  const deleteFeatured = async (img) => {
    setSpin(true);
    const confirm = window.confirm("Are you sure");
    if (confirm) {
      const { data } = await axios.put(
        `/api/featured/delete/${img}`,
        { featureId },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      if (data.success) {
        setSpin(false);
        setOK(true);
      }
    }
  };

  const AddFeatured = async (img, i) => {
    setOpen2(true);
    setIndex(i);
    setRemoveImg(img);
  };

  if (ok) {
    return <Featured />;
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
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "2rem",
                gap: "4rem",
              }}
            >
              <button
                onClick={() => {
                  setOpen(true);
                }}
                style={{
                  background: "tomato",
                  border: "none",
                  padding: "1rem 2rem",
                  cursor: "pointer",
                  fontSize: "1.4rem",
                }}
              >
                Create
              </button>
              <button
                onClick={() => {
                  setOpen3(true);
                }}
                style={{
                  background: "tomato",
                  border: "none",
                  padding: "1rem 2rem",
                  cursor: "pointer",
                  fontSize: "1.4rem",
                }}
              >
                Add more
              </button>
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "2rem",
                marginTop: "5rem",
              }}
            >
              {feature.length > 0 ? (
                feature.map((img, i) => {
                  return (
                    <div className="img-items">
                      <p style={{ textAlign: "center", fontSize: "1.2rem" }}>
                        {i + 1} Banner
                      </p>
                      <div>
                        <figure style={{ height: "120px" }}>
                          <img
                            src={`/uploads/${img}`}
                            alt=""
                            width={"100%"}
                            height={"100%"}
                          />
                        </figure>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-evenly",
                            gap: "2rem",
                            marginTop: "0.8rem",
                          }}
                        >
                          <button
                            style={{
                              background: "tomato",
                              border: "none",
                              padding: "0.2rem 2rem",
                              borderRadius: "2px",
                              cursor: "pointer",
                              fontSize: "1.2rem",
                              color: "white",
                            }}
                            onClick={() => {
                              AddFeatured(img, i);
                            }}
                          >
                            Add
                          </button>
                          <button
                            style={{
                              background: "tomato",
                              border: "none",
                              padding: "0.2rem 2rem",
                              borderRadius: "2px",
                              cursor: "pointer",
                              fontSize: "1.3rem",
                              color: "rgb(255, 255, 255)",
                            }}
                            onClick={() => {
                              deleteFeatured(img);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <h2 style={{ fontSize: "4rem", color: "gray" }}>
                  No Featured Image{" "}
                </h2>
              )}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "2rem",
              }}
            >
              {/* {feature.length > 0 && (
              <button
                style={{
                  background: "tomato",
                  border: "none",
                  padding: "1rem 2rem",
                  cursor: "pointer",
                  fontSize: "1.4rem",
                }}
                onClick={() => {
                  deleteFeatured();
                }}
              >
                Delte
              </button>
            )} */}
            </div>
            <Modal
              title="Form"
              centered
              open={open}
              onOk={() => setOpen(false)}
              onCancel={() => setOpen(false)}
            >
              <form
                className="form-wrapper"
                onSubmit={handleSubmit}
                method="post"
              >
                <div>
                  <input
                    type="file"
                    multiple
                    name="img"
                    placeholder="product image"
                    onChange={(e) => {
                      setImage(e.target.files);
                    }}
                  />
                </div>

                <div>
                  <button>Submit</button>
                </div>
              </form>
            </Modal>

            <Modal
              title="Form"
              centered
              open={open2}
              onOk={() => setOpen2(false)}
              onCancel={() => setOpen2(false)}
            >
              <form
                className="form-wrapper"
                onSubmit={handleSubmit2}
                method="PUT"
              >
                <div>
                  <input
                    type="file"
                    name="img"
                    placeholder="product image"
                    onChange={(e) => {
                      setImage2(e.target.files[0]);
                    }}
                  />
                </div>

                <div>
                  <button>Submit</button>
                </div>
              </form>
            </Modal>

            <Modal
              title="Form"
              centered
              open={open3}
              onOk={() => setOpen3(false)}
              onCancel={() => setOpen3(false)}
            >
              <form
                className="form-wrapper"
                onSubmit={handleSubmit3}
                method="PUT"
              >
                <div>
                  <input
                    type="file"
                    name="img"
                    placeholder="product image"
                    onChange={(e) => {
                      setImage3(e.target.files[0]);
                    }}
                  />
                </div>

                <div>
                  <button>Submit</button>
                </div>
              </form>
            </Modal>
          </div>
        )}
      </div>
    </section>
  );
};
