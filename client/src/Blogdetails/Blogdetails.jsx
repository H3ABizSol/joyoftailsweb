import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Blogdetails = () => {
  const param = useParams();
  const navigate = useNavigate("");
  const [blog, setBlogs] = useState({});
  const [userName, setUserName] = useState("");
  const [comments, setComment] = useState("");
  // const [userName , setUserName] = useState("")

  const getBlogs = async () => {
    const { data } = await axios.get(`/api/blog/${param.id}`);
    if (data.success) {
      setBlogs({ ...data.blogs });
    }
  };

  const comment = async (e) => {
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
      <h4>Comments</h4>
      <div className="user-comment">
        {blog.comments?.map((c) => {
          return (
            <div className="items">
              <p>{c.name}</p>
              <p>{c.comment}</p>
            </div>
          );
        })}
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
            <button>Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};
