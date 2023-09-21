import React, { useEffect, useState } from "react";
import "./Order.css";
import { Dashboardnav } from "../components/Dashboardnav/Dashboardnav";
import axios from "axios";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { Loader } from "../components/Loader/Loader";
import { ToastContainer, toast } from "react-toastify";
export const SubCategory = () => {
  const [category, setCategory] = useState([]);
  const [title, setTitle] = useState();
  const [subcategory, setSubCategory] = useState();
  const [subcategories, setSubCategories] = useState();
  const [change, setChange] = useState(false);
  const [animalType, setAnimalType] = useState();
  const [spin, setSpin] = useState(false);
  const [ok, setOk] = useState(true);

  const subCatDelete = () => {
    console.log("helo");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category || !animalType) {
      alert("please fill the value");
    } else {
      setSpin(true);

      const { data } = await axios.post(
        "/api/subcategory/create",
        { title, subcategory, animalType },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      if (data.success) {
        setSpin(false);
        setOk(true);
        toast.success("subcategory added successfully", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          fontSize: "50px",
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    }
  };

  const getCategory = async () => {
    const { data } = await axios.get("/api/category", {
      headers: {
        token: localStorage.getItem("token"),
      },
    });
    console.log(data);
    if (data.success) {
      const url = [];
      data.categories.map((c) => {
        const title = c.title.map((c) => {
          return url.push(c.name);
        });
      });
      setCategory([...url]);
      setTitle(url[0]);
    }
  };
  const getSubCategory = async () => {
    const { data } = await axios.get("/api/subcategory", {
      headers: {
        token: localStorage.getItem("token"),
      },
    });
    console.log(data);
    if (data.success) {
      setSubCategories([...data.subcategories]);
    }
  };

  const openDiv = () => {
    setChange(!change);
  };

  useEffect(() => {
    getCategory();
    getSubCategory();
  }, []);

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
                    placeholder=" Select Category title"
                    style={{ padding: "2rem 2rem", width: "30%" }}
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                  />
                  <select
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                  >
                    {category &&
                      category.map((c) => {
                        return <option value={c}>{c}</option>;
                      })}
                  </select>
                </div>
                <div className="form-content">
                  <input
                    type="text"
                    name="title"
                    value={subcategory}
                    placeholder=" Enter Category title  bones,chews,toy etc..."
                    style={{ padding: "2rem 2rem" }}
                    onChange={(e) => {
                      setSubCategory(e.target.value);
                    }}
                  />
                  <input
                    type="text"
                    name="title"
                    value={animalType}
                    placeholder="animal Type"
                    style={{ padding: "2rem 2rem" }}
                    onChange={(e) => {
                      setAnimalType(e.target.value);
                    }}
                  />
                </div>

                <div>
                  <button className="modal-btn">Submit</button>
                </div>
              </form>
            </div>

            <div className="main-sub-cat">
              {subcategories &&
                subcategories.map((sub) => {
                  return <ChangeDivSection data={sub} />;
                })}
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </section>
  );
};

const ChangeDivSection = ({ data }) => {
  const [change, setChange] = useState(false);
  const [spin, setSpin] = useState(false);
  const [ok, setOk] = useState(true);
  const openDiv = () => {
    setChange(!change);
  };
  const deleteSub = async (id, name) => {
    setSpin(true);
    const confirm = window.confirm("Are you sure");
    if (confirm) {
      const { data } = await axios.delete(`/api/subcategory/delete/${id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
        data: {
          name,
        },
      });
      console.log(data);
      if (data.success) {
        toast.success("subcategory deleted successfully", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          fontSize: "50px",
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    }
  };

  return (
    <>
      <div className="point">
        <div className="upper-case">
          <h3
            onClick={() => {
              openDiv();
            }}
          >
            {data.title}
          </h3>
          <span style={{ fontSize: "1.2rem" }}>{data.animalType}</span>
        </div>
        {change ? (
          <div className="down-case">
            {data.subCategories.map((name) => {
              return (
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    alignItems: "center",
                  }}
                >
                  <span>{name}</span>

                  <AiOutlineDelete
                    size={15}
                    onClick={() => {
                      deleteSub(data._id, name);
                    }}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};
