import React, { useEffect, useState } from "react";
import "./Order.css";
import { Dashboardnav } from "../components/Dashboardnav/Dashboardnav";
import axios from "axios";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { IoMdMailOpen } from "react-icons/io";
import { BsTelephoneFill } from "react-icons/bs";
import { Loader } from "../components/Loader/Loader";

export const Information = () => {
  const [heading, setHeading] = useState("");
  const [desc, setDesc] = useState("");
  const [support, setSupport] = useState("");
  const [img, setImage] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [information, setInformation] = useState(null);
  const [ok, setOk] = useState(false);
  const [spin, setSpin] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSpin(true);
    console.log(img);
    const formData = new FormData();
    formData.append("heading", heading);
    formData.append("desc", desc);
    formData.append("img", img);
    formData.append("email", email);
    formData.append("mobile", mobile);
    formData.append("support", support);
    const { data } = await axios.post("/api/information/create", formData, {
      headers: {
        token: localStorage.getItem("token"),
      },
    });
    console.log(data);
    if (data.success) {
      setOk(true);
      setSpin(false);
    }
  };
  const getInformation = async () => {
    setSpin(true);
    const { data } = await axios.get("/api/information", {
      headers: {
        token: localStorage.getItem("token"),
      },
    });
    console.log(data);
    if (data.success) {
      setInformation({ ...data.information });
      if (data.information) {
        setEmail(data.information.email);
        setMobile(data.information.mobile);
        setImage(data.information.img);
        setHeading(data.information.heading);
        setSupport(data.information.support);
        setDesc(data.information.desc);
        setSpin(false);
      }
    }
    setSpin(false);
  };

  const deleteInfo = async (e) => {
    const confirm = window.confirm("Are you sure");
    if (confirm) {
      const { data } = await axios.delete(`/api/information/delete`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
    }
    setOk(true);
  };

  useEffect(() => {
    getInformation();
  }, []);
  if (ok) {
    return <Information />;
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
                    value={heading}
                    placeholder="heading"
                    style={{ padding: "2rem 2rem" }}
                    onChange={(e) => {
                      setHeading(e.target.value);
                    }}
                  />
                  <input
                    type="text"
                    value={desc}
                    name="title"
                    placeholder="description"
                    style={{ padding: "2rem 2rem" }}
                    onChange={(e) => {
                      setDesc(e.target.value);
                    }}
                  />
                </div>
                <div className="form-content">
                  <input
                    type="text"
                    name="title"
                    value={support}
                    placeholder="what you support"
                    style={{ padding: "2rem 2rem" }}
                    onChange={(e) => {
                      setSupport(e.target.value);
                    }}
                  />
                  <input
                    type="email"
                    name="title"
                    value={email}
                    placeholder="email"
                    style={{ padding: "2rem 2rem" }}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </div>
                <div className="form-content">
                  <input
                    type="text"
                    name="title"
                    value={mobile}
                    placeholder="mobile"
                    style={{ padding: "2rem 2rem" }}
                    onChange={(e) => {
                      setMobile(e.target.value);
                    }}
                  />
                  <input
                    type="file"
                    name="title"
                    style={{ padding: "2rem 2rem" }}
                    onChange={(e) => {
                      setImage(e.target.files[0]);
                    }}
                  />

                  <div>
                    <button className="modal-btn">Create</button>
                  </div>
                </div>
              </form>
            </div>
            <div className="right-section">
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "2rem",
                }}
              >
                {information && (
                  <button
                    className="modal-btn"
                    onClick={() => {
                      deleteInfo();
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
              {information && (
                <div
                  className="service-section"
                  style={{
                    marginTop: "1.4rem",
                    boxShadow: "0 0 5px gray",
                    padding: "5rem 0.6rem",
                  }}
                >
                  <figure>
                    <img src={`/uploads/${information.img}`} alt="girl" />
                  </figure>
                  <div className="service-content">
                    <h2>{information.heading}</h2>

                    <p>{information.desc}</p>
                    <div className="servicelist">
                      {information.support &&
                        information.support.split(",").map((e) => {
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
                          <a href={information.email}>{information.email}</a>
                        </div>
                      </div>
                      <div className="common-contact">
                        <a href="">
                          <BsTelephoneFill style={{ fontSize: "2.4rem" }} />
                        </a>
                        <div>
                          <p>Contact us anytime</p>
                          <a>{information.mobile}</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
