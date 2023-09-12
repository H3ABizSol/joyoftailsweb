import React, { useEffect, useState } from "react";
import "./Blog.css";
import axios from "axios";
import { Link } from "react-router-dom";

export const UserBlog = () => {
  const [blog, setBlogs] = useState([]);

  const getBlogs = async () => {
    const { data } = await axios.get("/api/blog");
    if (data.success) {
      setBlogs([...data.blogs]);
    }
  };

  useEffect(() => {
    getBlogs();
  });
  return (
    <div className="blog-container">
      {blog &&
        blog.map((b) => {
          return (
            <Link to={`/blogdetails/${b._id}`}>
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
              </div>
            </Link>
          );
        })}
    </div>
  );
};
