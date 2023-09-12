import React, { useEffect } from "react";
import "./blog.css";
import { Dashboardnav } from "../components/Dashboardnav/Dashboardnav";
import { useState } from "react";
import { Loader } from "../components/Loader/Loader";
import axios from "axios";
import { Link } from "react-router-dom";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { Modal } from "antd";

export const Blog = () => {
  const [spin, setSpin] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [img, setImg] = useState("");
  const [ok, setOk] = useState(false);

  const [titleUpdated, setTitleUpdated] = useState("");
  const [descUpdated, setDescUpdated] = useState("");
  const [imgUpdated, setImgUpdated] = useState("");

  const [updateId, setUpdateId] = useState("");
  const [blog, setBlogs] = useState([]);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("img", img);
    formData.append("title", title);
    formData.append("desc", desc);
    const { data } = await axios.post("/api/blog/create", formData, {
      headers: {
        token: localStorage.getItem("token"),
      },
    });
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    console.log(imgUpdated);

    const formData = new FormData();
    formData.append("img", imgUpdated);
    formData.append("title", titleUpdated);
    formData.append("desc", descUpdated);
    const { data } = await axios.put(`/api/blog/update/${updateId}`, formData, {
      headers: {
        token: localStorage.getItem("token"),
        // "Content-Type": "application/json",
      },
    });
    if (data.success) {
      setOk(true);
    }
  };

  const getBlogs = async () => {
    const { data } = await axios.get("/api/blog");
    if (data.success) {
      setBlogs([...data.blogs]);
    }
  };
  const deleteBlog = async (b) => {
    console.log(b);
    const { data } = await axios.delete(`/api/blog/delete/${b._id}`);
    console.log(data);
  };

  const updateBlog = (b) => {
    setTitleUpdated(b.title);
    setDescUpdated(b.desc);
    setImgUpdated(b.img);
  };

  useEffect(() => {
    getBlogs();
  });
  if (ok) {
    return <Blog />;
  }
  return (
    <section className="dashboard-section">
      <Modal
        title="Form"
        centered
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        width={"65%"}
        footer={null}
      >
        <div className="edit-wrapper">
          <form
            className="form-wrapper"
            onSubmit={handleSubmitUpdate}
            method="put"
          >
            <div className="form-content">
              <input
                type="text"
                name="brand"
                placeholder="title"
                onChange={(e) => {
                  setTitleUpdated(e.target.value);
                }}
                value={titleUpdated}
              />
              <input
                type="file"
                onChange={(e) => {
                  setImgUpdated(e.target.files[0]);
                }}
              />
            </div>
            <textarea
              name="desc"
              placeholder="description"
              onChange={(e) => {
                setDescUpdated(e.target.value);
              }}
              value={descUpdated}
            ></textarea>
            <div>
              <button className="modal-btn">Submit</button>
            </div>
          </form>
        </div>
      </Modal>
      <div className="dashboard-wrapper">
        <div className="left-section">
          <Dashboardnav />
        </div>
        {spin ? (
          <Loader />
        ) : (
          <div className="right-section">
            <div className="edit-wrapper">
              <form
                className="form-wrapper"
                onSubmit={handleSubmit}
                method="post"
              >
                <h2>Create Blogs</h2>
                <div className="form-content">
                  <input
                    type="text"
                    name="brand"
                    placeholder="title"
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                    value={title}
                  />
                  <input
                    type="file"
                    onChange={(e) => {
                      setImg(e.target.files[0]);
                    }}
                  />
                </div>
                <textarea
                  name="desc"
                  placeholder="description"
                  onChange={(e) => {
                    setDesc(e.target.value);
                  }}
                  value={desc}
                ></textarea>
                <div>
                  <button className="modal-btn">Submit</button>
                </div>
              </form>
            </div>
            <div className="blog-container-dashboard">
              {blog &&
                blog.map((b) => {
                  return (
                    <div className="items">
                      <figure>
                        <img src={`/uploads/${b.img}`} alt="" />
                      </figure>
                      <h3>{b.title}</h3>
                      <span>{new Date(b.createdAt).toLocaleDateString()}</span>
                      <p>{b.desc}</p>
                      <Link to={`/blogdetails/${b._id}`}>
                        <button
                          style={{
                            border: "1px solid black",
                            borderRadius: "0",
                            backgroundColor: "transparent",
                          }}
                        >
                          Read More
                        </button>
                      </Link>
                      <div
                        style={{
                          marginTop: "1.2rem",
                          display: "flex",
                          gap: "1rem",
                        }}
                      >
                        <AiOutlineDelete
                          size={25}
                          onClick={() => {
                            deleteBlog(b);
                          }}
                        />
                        <AiOutlineEdit
                          size={25}
                          onClick={() => {
                            updateBlog(b);
                            setOpen(true);
                            setUpdateId(b._id);
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
