import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export const Blogdetails = () => {
  const param = useParams();
  const navigate = useNavigate("");
  const [blog, setBlogs] = useState({});
  const [userName, setUserName] = useState("");
  const [comments, setComment] = useState("");
  const [spin, setSpin] = useState(false);
  const [ok, setOk] = useState(false);

  // const [userName , setUserName] = useState("")
  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 18,
        marginTop: "-2rem",
        color: "black",
      }}
      spin
    />
  );

  const getBlogs = async () => {
    const { data } = await axios.get(`/api/blog/${param.id}`);
    if (data.success) {
      setBlogs({ ...data.blogs });
    }
  };

  const comment = async (e) => {
    setSpin(true);
    e.preventDefault();
    if (localStorage.getItem("token")) {
      const { data } = await axios.post(
        `/api/blog/comment/${param.id}`,
        {
          comment: comments,
          name: userName,
          userId: localStorage.getItem("id"),
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      if (data.success) {
        setSpin(false);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } else {
      toast.error("you have to login first", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
    }
  };

  useEffect(() => {
    getBlogs();
  }, []);
  return (
    <div className="blog-details-container">
      <ToastContainer />
      <div className="items">
        <figure>
          <img src={`/uploads/${blog.img}`} alt="" />
        </figure>
        <h3>{blog.title}</h3>
        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
        <p>{blog.desc}</p>
      </div>

      <h4>Leave comments</h4>
      <div className="comment">
        <form action="" onSubmit={comment} method="post">
          <div>
            <input
              type="text"
              name=""
              id=""
              placeholder="name"
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
              }}
            />
          </div>
          <div>
            <textarea
              placeholder="comment"
              rows={8}
              value={comments}
              onChange={(e) => {
                setComment(e.target.value);
              }}
            />
          </div>
          <div>
            <button>Submit {spin && <Spin indicator={antIcon} />}</button>
          </div>
        </form>
        {blog.comments?.length > 0 && <h4>Comments</h4>}

        {blog.comments?.length > 0 && (
          <div className="user-comment">
            {blog.comments?.map((c) => {
              return (
                <div className="message-items">
                  <div className="name">{c.name}</div>
                  <div className="comment-mess">{c.comment}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
