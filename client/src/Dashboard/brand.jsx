import React, { useEffect, useState } from "react";
import "./Order.css";
import { Dashboardnav } from "../components/Dashboardnav/Dashboardnav";
import axios from "axios";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { Modal } from "antd";
import { Loader } from "../components/Loader/Loader";

export const Brand = () => {
  const [brandname, setBrandName] = useState("");
  const [brandname2, setBrandName2] = useState("");
  const [brandImage, setBrandImage] = useState([]);
  const [brandImage2, setBrandImage2] = useState("");
  const [open, setOpen] = useState(false);
  const [paramid, setparmsid] = useState(false);
  const [brands, setBrand] = useState([]);
  const [status, setStatus] = useState("");
  const [ok, setOk] = useState(false);
  const [spin, setSpin] = useState(false);

  const handleSubmit = async (e) => {
    setSpin(true);
    const formData = new FormData();
    for (const items of brandImage) {
      formData.append("img", items);
    }
    formData.append("brandname", brandname);
    const { data } = await axios.post("/api/brand/create", formData, {
      headers: {
        token: localStorage.getItem("token"),
      },
    });
    if (data.success) {
      setOk(true);
      setSpin(false);
    }
  };
  const handleSubmitForm = async (e) => {
    setSpin(true);
    e.preventDefault();
    const formData2 = new FormData();
    formData2.append("brandname", brandname2);
    formData2.append("status", status);
    formData2.append("img", brandImage2);
    const { data } = await axios.put(`/api/brand/edit/${paramid}`, formData2, {
      headers: {
        token: localStorage.getItem("token"),
      },
    });
    setOk(true);
    setSpin(false);
  };
  const changeStatus = async (b, e) => {
    setSpin(true);
    const { data } = await axios.put(
      `/api/brand/changestatus/${b._id}`,
      { status: e.target.value },
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    );
    setSpin(false);
    setOk(true);
  };

  const getBrands = async () => {
    setSpin(true);
    const { data } = await axios.get("/api/brand", {
      headers: {
        token: localStorage.getItem("token"),
      },
    });
    if (data.success) {
      const url = [];
      data.brands.map((b) => {
        b.brand.map((b) => {
          url.push(b);
        });
      });
      console.log(url);
      setBrand([...url]);
      setSpin(false);
    }
  };

  const deleteBrand = async (e) => {
    setSpin(true);
    const confirm = window.confirm("Are you sure");
    if (confirm) {
      const { data } = await axios.delete(`/api/brand/delete/${e._id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
    }
    setSpin(false);
    setOk(true);
  };

  useEffect(() => {
    getBrands();
  }, []);

  if (ok) {
    return <Brand />;
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
                    value={brandname}
                    placeholder="Brand titles peddigree ,meatup etc..."
                    style={{ padding: "2rem 2rem" }}
                    onChange={(e) => {
                      setBrandName(e.target.value);
                    }}
                  />
                  <input
                    type="file"
                    multiple
                    name="title"
                    placeholder="Category title"
                    style={{ padding: "2rem 2rem" }}
                    onChange={(e) => {
                      setBrandImage(e.target.files);
                    }}
                  />
                  <div>
                    <button className="modal-btn">Submit</button>
                  </div>
                </div>
              </form>
            </div>
            <div className="right-section">
              <div className="brand-wrapper">
                {brands &&
                  brands.map((b) => {
                    return (
                      <div className="brand-items">
                        <figure>
                          <img src={`/uploads/${b.img}`} alt="" />
                        </figure>
                        <h4>{b.name}</h4>
                        <div style={{ display: "flex", gap: "0.8rem" }}>
                          <button
                            onClick={() => {
                              setBrandName2(b.name);
                              setBrandImage2(b.img);
                              setparmsid(b._id);
                              setStatus(b.isPopular);
                              setOpen(true);
                            }}
                          >
                            <AiOutlineEdit className="edit" />
                          </button>
                          <button
                            onClick={() => {
                              deleteBrand(b);
                            }}
                          >
                            <AiOutlineDelete className="delete" />
                          </button>
                          <select
                            onChange={(e) => {
                              changeStatus(b, e);
                            }}
                            value={b.isPopular}
                          >
                            <option value="none">None</option>
                            <option value="popular">Popular</option>
                          </select>
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
              name="brandname"
              value={brandname2}
              placeholder="Category title"
              // style={{ padding: "2rem 2rem" }}
              onChange={(e) => {
                setBrandName2(e.target.value);
              }}
            />
            <input
              type="file"
              placeholder="Category title"
              // style={{ padding: "2rem 2rem" }}
              onChange={(e) => {
                setBrandImage2(e.target.files[0]);
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
