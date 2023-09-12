import React, { useEffect, useState } from "react";
import "./Order.css";
import { Dashboardnav } from "../components/Dashboardnav/Dashboardnav";
import axios from "axios";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { Modal } from "antd";
import { Loader } from "../components/Loader/Loader";

export const Category = () => {
  const [image, setImages] = useState("");
  const [image2, setImages2] = useState("");
  const [popular, setPopular] = useState("");
  const [spin, setSpin] = useState(false);

  const [category, setCategory] = useState([]);
  const [open, setOpen] = useState(false);
  const [paramid, setparmsid] = useState("");

  const [title, setTitle] = useState();
  const [title2, setTitle2] = useState();
  const [ok, setOk] = useState(false);

  const handleSubmit = async (e) => {
    setSpin(true);
    console.log(image);
    e.preventDefault();
    const formData = new FormData();
    for (const items of image) {
      formData.append("img", items);
    }
    formData.append("title", title);
    const { data } = await axios.post("/api/category/create", formData, {
      headers: {
        token: localStorage.getItem("token"),
      },
    });
    setOk(true);
    setSpin(false);
  };

  const getCategory = async () => {
    setSpin(true);
    const { data } = await axios.get("/api/category", {
      headers: {
        token: localStorage.getItem("token"),
      },
    });
    if (data.success) {
      const url = [];
      data.categories.map((c) => {
        const title = c.title.map((c) => {
          return url.push(c);
        });
      });
      setCategory([...url]);
      setSpin(false);
    }
  };

  const changePopularStatus = async (e, c) => {
    setSpin(true);
    const { data } = await axios.put(
      `/api/category/changestatus/${c._id}`,
      { status: e.target.value, name: c.name },
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    );
    setOk(true);
    setSpin(false);
  };

  const deleteAccessories = async (b, i) => {
    setSpin(true);
    const confirm = window.confirm("Are you sure");
    if (confirm) {
      const { data } = await axios.delete(`/api/category/delete/${b._id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
        data: {
          img: b.img,
        },
      });
      if (data.success) {
        setOk(true);
        setSpin(false);
      }
    }
  };

  const handleSubmitForm = async (e) => {
    setSpin(true);
    e.preventDefault();
    const formData2 = new FormData();
    formData2.append("img", image2);
    formData2.append("title", title2);
    formData2.append("popular", popular);

    const { data } = await axios.put(
      `/api/category/edit/${paramid}`,
      formData2,
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    );
    if (data.success) {
      setOk(true);
      setSpin(false);
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

  if (ok) {
    return <Category />;
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
            <div style={{ width: "60%", margin: "5rem auto" }}>
              <form
                className="form-wrapper"
                onSubmit={handleSubmit}
                method="post"
              >
                <div className="form-content">
                  <input
                    type="text"
                    name="title"
                    value={title}
                    placeholder="Category title"
                    style={{ padding: "2rem 2rem" }}
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                  />

                  <input
                    type="file"
                    multiple
                    style={{ padding: "2rem 2rem" }}
                    onChange={(e) => {
                      setImages(e.target.files);
                    }}
                  />
                  <div>
                    <button className="modal-btn">Submit</button>
                  </div>
                </div>
              </form>
            </div>
            <div className="right-section">
              <div className="cat-wrapper">
                <div className="grid-cat">
                  <p>SR No</p>
                  <p> CATEGORIES</p>
                  <p>STATUS</p>
                  <p>ACTION</p>
                </div>
                {category.length > 0 &&
                  category.map((o, index) => {
                    return (
                      <div className="grid-cat">
                        <p>{index + 1}</p>
                        <p>{o.name}</p>
                        <select
                          onChange={(e) => {
                            // console.log(e.target.value);
                            changePopularStatus(e, o);
                          }}
                          value={o.isPopular}
                        >
                          <option value="none">None</option>
                          <option value="popular">Popular</option>
                        </select>
                        <div
                          className="btn-wrapper"
                          style={{
                            display: "flex",
                            gap: " 2rem",
                            justifyContent: "center",
                          }}
                        >
                          <button
                            onClick={() => {
                              setparmsid(o._id);
                              setTitle2(o.name);
                              setImages2(o.img);
                              setPopular(o.isPopular);
                              setOpen(true);
                            }}
                          >
                            <AiOutlineEdit className="edit" />
                          </button>
                          <button
                            onClick={() => {
                              deleteAccessories(o, index);
                            }}
                          >
                            <AiOutlineDelete className="delete" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </div>
      <Modal
        title="Form"
        centered
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        width={"40%"}
        footer={null}
      >
        <form className="form-wrapper" onSubmit={handleSubmitForm} method="put">
          <div className="form-content">
            <input
              type="text"
              name="category"
              value={title2}
              placeholder="Category title"
              style={{ padding: "2rem 2rem" }}
              onChange={(e) => {
                setTitle2(e.target.value);
              }}
            />
            <input
              type="file"
              multiple
              style={{ padding: "2rem 2rem" }}
              onChange={(e) => {
                setImages2(e.target.files[0]);
              }}
            />
            <div>
              <button className="modal-btn">Submit</button>
            </div>
          </div>
        </form>
      </Modal>
    </section>
  );
};
