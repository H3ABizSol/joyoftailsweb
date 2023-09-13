import "./Dashboard.css";
import ReactPaginate from "react-paginate";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal } from "antd";
import { Dashboardnav } from "../components/Dashboardnav/Dashboardnav";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { Loader } from "../components/Loader/Loader";

export const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [blur, setBlur] = useState(false);
  const [show, setShow] = useState(false);
  const [add, setAdd] = useState([]);
  const [pageCount, setPageCount] = useState("");
  const [keyword, setKeyword] = useState("");
  const [ok, setOK] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [filterProducts, setFilterProducts] = useState([]);
  const [isFilter, setIsFilter] = useState(false);
  const [isProducts, setIsProducts] = useState(true);
  const [image, setImage] = useState("");
  const [sellingprice, setSelling] = useState(0);
  const [actualsellingprice, setActualSelling] = useState(0);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [subCategory2, setSubCategory2] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");
  const [spin, setSpin] = useState(false);
  const [animalType, setAnimalType] = useState([]);
  const [animalTypeData, setAnimalTypeData] = useState("");
  const [brand, setBrand] = useState([]);

  const [formdata, setFormData] = useState({
    brand: "",
    title: "",
    desc: "",
    categories: "",
    subCategories: "",
    color: "",
    stock: "",
    foodType: "",
    animalType: "",
    gramPerQuantity: "",
    discount: 0,
    mrp: "",
    sizePrice: "",
  });

  const getProducts = async () => {
    setSpin(true);
    const { data } = await axios.get(`/api/product?limit=${12}`);
    setAllProducts([...data.product]);
    setPageCount(data.pageCount);
    setSpin(false);
  };

  const getBrands = async () => {
    const { data } = await axios.get("/api/brand", {
      headers: {
        token: localStorage.getItem("token"),
      },
    });
    console.log(data);
    if (data.success) {
      const url = [];
      data.brands.map((b) => {
        b.brand.map((b) => {
          url.push(b);
        });
      });
      console.log(url);
      setBrand([...url]);
      setFormData({
        ...formdata,
        brand: url[0].name,
      });
    }
  };

  const getCategory = async () => {
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
      console.log(url);
      setCategory([...url]);
      setFormData({
        ...formdata,
        categories: url[0].name,
      });
    }
  };

  const getSubCategory = async () => {
    const { data } = await axios.get("/api/subcategory", {
      headers: {
        token: localStorage.getItem("token"),
      },
    });
    if (data.success) {
      setAnimalType([
        ...new Set(
          data.subcategories.map((e) => {
            return e.animalType;
          })
        ),
      ]);
      setAnimalTypeData(animalType[0]);
      setSubCategory2([...data.subcategories[0].subCategories]);
      setSubCategory([...data.subcategories]);
      setFormData({
        ...formdata,
        subCategories: data.subcategories[0].subCategories[0],
      });
    }
  };

  useEffect(() => {
    getBrands();
    getCategory();
    getSubCategory();
    getProducts();
  }, [show]);

  const handleChange = (e) => {
    setFormData({
      ...formdata,
      [e.target.name]: e.target.value,
    });
  };

  const changePage = async ({ selected }) => {
    const { data } = await axios.get(
      `/api/product?page=${selected + 1} & limit=${12}`
    );
    setAllProducts(data.product);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formdata);
    let formData = new FormData();
    for (let i = 0; i < image.length; i++) {
      formData.append("img", image[i]);
    }
    formData.append("title", formdata.title);
    formData.append("Stock", formdata.stock);
    formData.append("brand", formdata.brand);
    formData.append("sizePrice", formdata.sizePrice);
    formData.append("animalType", formdata.animalType);
    formData.append("foodType", formdata.foodType);
    formData.append("gramPerQuantity", formdata.gramPerQuantity);
    formData.append("desc", formdata.desc);
    formData.append("price", formdata.mrp);
    formData.append("categories", formdata.categories);
    formData.append("subCategories", formdata.subCategories);
    formData.append("color", formdata.color);
    formData.append("sellingPrice", formdata.mrp - sellingprice);
    formData.append("discount", formdata.discount);

    const { data } = await axios.post("/api/product", formData, {
      headers: {
        token: Cookies.get("token"),
      },
    });
    setFormData({
      brand: "",
      title: "",
      desc: "",
      categories: "",
      color: "",
      stock: "",
      price: "",
    });
    setOpen(false);
    if (data.success) {
      setOK(true);
      alert("Product created Successfully");
    }
  };

  const deleteProduct = async (id) => {
    const val = window.confirm("Are you Sure");
    if (val) {
      const { data } = await axios.delete(`/api/product/${id}`, {
        headers: {
          token: Cookies.get("token"),
        },
      });
      if (data.success) {
        setOK(true);
      }
    }
  };

  const search = () => {
    const filterData = allProducts.filter((items) => {
      if (keyword === "") {
        setIsFilter(false);
        setIsProducts(true);
        return allProducts;
      }
      if (items.title.toLowerCase().includes(keyword.toLowerCase())) {
        setIsFilter(true);
        setIsProducts(false);
        return items;
      }
      if (items.desc.toLowerCase().includes(keyword.toLowerCase())) {
        setIsFilter(true);
        setIsProducts(false);
        return items;
      }
      if (
        items.categories.category.toLowerCase().includes(keyword.toLowerCase())
      ) {
        setIsFilter(true);
        setIsProducts(false);
        return items;
      }
      if (
        items.price.toString().toLowerCase().includes(keyword.toLowerCase())
      ) {
        setIsFilter(true);
        setIsProducts(false);
        return items;
      }
    });
    console.log(filterData);
    setFilterProducts([...filterData]);
  };

  const setsubcategorydata = (e) => {
    setCategoryName(e.target.value);
    const filterData = subCategory.filter((c) => {
      return (
        c.title.toLowerCase() === e.target.value.toLowerCase() &&
        c.animalType.toLowerCase() === animalTypeData.toLocaleLowerCase()
      );
    });
    if (filterData.length > 0) {
      setSubCategory2([...filterData[0].subCategories]);
      setSubCategoryName("All");
    } else {
      setSubCategory2([]);
    }
  };

  const setcategorydata = (e) => {
    console.log(e.target.value);
    console.log(e);
    const filterData = subCategory.filter((c) => {
      return c.animalType.toLowerCase() === e.target.value.toLowerCase();
    });
    if (filterData.length > 0) {
      setCategory([...filterData]);
      setSubCategoryName("All");
    } else {
      setSubCategory([]);
    }
  };
  console.log(category);
  if (ok) {
    return <Dashboard />;
  }
  return (
    <section className=" dashboard-section">
      <Modal
        title="Form"
        centered
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        width={"70%"}
        footer={null}
      >
        <form className="form-wrapper" onSubmit={handleSubmit} method="post">
          <div className="form-content">
            <select
              value={formdata.brand}
              onChange={(e) => {
                setFormData({
                  ...formdata,
                  brand: e.target.value,
                });
              }}
            >
              <option value="">Brands</option>
              {brand.length > 0 &&
                brand.map((e) => {
                  return <option value={e.name}>{e.name}</option>;
                })}
            </select>
            <input
              type="text"
              name="title"
              placeholder="product title"
              onChange={handleChange}
              value={formdata.title}
            />
          </div>

          <div className="form-content">
            <select
              value={animalTypeData}
              onChange={(e) => {
                setAnimalTypeData(e.target.value);
                setcategorydata(e);
                setFormData({
                  ...formdata,
                  animalType: e.target.value,
                });
              }}
            >
              <option value="">Animal Type</option>
              {animalType &&
                animalType.map((e) => {
                  return <option value={e}>{e}</option>;
                })}
            </select>

            <select
              value={categoryName}
              className="common-select"
              onChange={(e) => {
                setsubcategorydata(e);
                setFormData({
                  ...formdata,
                  categories: e.target.value,
                });
              }}
            >
              <option value="">Category</option>

              {category &&
                category.map((c) => {
                  return <option value={c.title}>{c.title}</option>;
                })}
            </select>
            <select
              className="common-select"
              onChange={(e) => {
                setSubCategoryName(e.target.value);
                setFormData({
                  ...formdata,
                  subCategories: e.target.value,
                });
              }}
              value={subCategoryName}
            >
              <option value="">Sub Category</option>

              {subCategory2.length > 0 &&
                subCategory2.map((c) => {
                  return <option value={c}>{c}</option>;
                })}
            </select>

            <input
              type="text"
              name="color"
              placeholder="product color"
              onChange={handleChange}
              value={formdata.color}
            />
          </div>

          <div>
            <textarea
              type="text"
              name="desc"
              placeholder="product description"
              onChange={handleChange}
              value={formdata.desc}
              rows={8}
            />
          </div>
          <div className="form-content">
            <input
              type="text"
              name="gramPerQuantity"
              placeholder="sizes in gram,cm etc "
              onChange={handleChange}
              value={formdata.gramPerQuantity}
            />
            <input
              type="text"
              name="sizePrice"
              id=""
              placeholder="price of sizes"
              onChange={handleChange}
              value={formdata.sizePrice}
            />

            <input
              type="text"
              name="foodType"
              placeholder="food type"
              onChange={handleChange}
              value={formdata.foodtype}
            />
          </div>

          <div className="form-content">
            <input
              type="file"
              multiple
              name="img"
              placeholder="product image"
              onChange={(e) => {
                setImage(e.target.files);
              }}
            />
            <input
              type="text"
              name="stock"
              placeholder="product stock"
              onChange={handleChange}
              value={formdata.stock}
            />
            <input
              type="text"
              name="mrp"
              placeholder="product price in MRP"
              onChange={handleChange}
              value={formdata.mrp}
            />
          </div>
          <div className="form-content">
            <p style={{ width: "20%" }}>Dicount in %</p>
            <input
              type="text"
              name="discount"
              placeholder="discount in % "
              onChange={handleChange}
              value={formdata.discount}
              onKeyUp={() => {
                setSelling(
                  (Number(formdata.mrp) * Number(formdata.discount)) / 100
                );
              }}
            />
            <p style={{ width: "20%" }}>Seeling Price</p>
            <input
              type="text"
              name="sellingprice"
              placeholder="sellingprice "
              value={formdata.mrp - sellingprice}
            />
          </div>

          <div>
            <button className="modal-btn">Submit</button>
          </div>
        </form>
      </Modal>

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
                justifyContent: "space-around",
                alignItems: "center",
                padding: "1.5rem ",
              }}
            >
              <input
                type="search"
                name=""
                id=""
                placeholder="search by price,name,categories etc"
                onKeyUp={search}
                onChange={(e) => {
                  setKeyword(e.target.value);
                }}
              />
              <button
                onClick={() => {
                  window.document.body.classList.add("bg-blur");
                  setBlur(true);
                  setOpen(true);
                }}
                style={{
                  borderRadius: "4px",
                  padding: "0.8rem 2rem",
                  border: "none",
                  outline: "none",
                  textAlign: "end",
                  margin: "0.8rem 4rem",
                  cursor: "pointer",
                }}
              >
                Create
              </button>
            </div>
            {/* {allProducts.length < 0 && <h2>No Products</h2>} */}
            <div className="items-wrapper">
              {isProducts && allProducts.length > 0 ? (
                allProducts.map((products) => {
                  return (
                    <div className="items">
                      <Link to={`/productsdetails/${products._id}`}>
                        <figure>
                          <img
                            src={`/uploads/${products.img[0]}`}
                            style={{ width: "100%" }}
                          />
                        </figure>
                        <h2>{products.title}</h2>
                        <p
                          style={{
                            textAlign: "center",
                            fontSize: "1.2rem",
                            fontWeight: "600",
                            marginTop: "2rem",
                          }}
                        >
                          Brand : {products.brand}
                        </p>
                      </Link>{" "}
                      <div className="btn-container">
                        {" "}
                        <Link to={`/edit/${products._id}`} className="left-btn">
                          <button>Edit</button>{" "}
                        </Link>{" "}
                        <button
                          className="right-btn"
                          onClick={() => {
                            deleteProduct(products._id);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    // <div className="items">
                    //   <img src={`/uploads/${products.img[0]}`} />
                    //   <div
                    //     style={{
                    //       display: "flex",
                    //       flexDirection: "column",
                    //       gap: "1.5rem",
                    //       padding: "0 7rem",
                    //     }}
                    //   >
                    //     <h2>{products.title}</h2>
                    //     <p style={{ fontSize: "1.4rem", fontWeight: "600" }}>
                    //       ₹ {products.price}
                    //     </p>
                    //   </div>
                    //   <div className="btn-container">
                    //     <Link to={`/edit/${products._id}`} className="left-btn">
                    //       <button>Edit</button>
                    //     </Link>
                    //     <button
                    //       className="right-btn"
                    //       onClick={() => {
                    //         deleteProduct(products._id);
                    //       }}
                    //     >
                    //       Delete
                    //     </button>
                    //   </div>
                    // </div>
                  );
                })
              ) : (
                <h2
                  style={{
                    textAlign: "center",
                    fontSize: "4rem",
                    color: "gray",
                  }}
                ></h2>
              )}
            </div>
            <div className="items-wrapper">
              {isFilter &&
                filterProducts.map((products) => {
                  return (
                    <div className="items">
                      <img src={`/uploads/${products.img[0]}`} />
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "1.5rem",
                          padding: "0 7rem",
                        }}
                      >
                        <h2>{products.title}</h2>
                        <p style={{ fontSize: "1.4rem", fontWeight: "600" }}>
                          ₹ {products.price}
                        </p>
                      </div>
                      <div className="btn-container">
                        <Link to={`/edit/${products._id}`}>
                          <button>Edit</button>
                        </Link>
                        <button
                          onClick={() => {
                            deleteProduct(products._id);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "4rem",
              }}
            >
              {isProducts && (
                <ReactPaginate
                  breakLabel="..."
                  nextLabel="next >"
                  onPageChange={changePage}
                  pageRangeDisplayed={pageCount}
                  containerClassName="pagination"
                  pageLinkClassName="page-num"
                  activeClassName="active"
                  pageCount={pageCount}
                  marginPagesDisplayed={2}
                  previousLabel="< previous"
                  renderOnZeroPageCount={null}
                />
              )}
              {isFilter && (
                <ReactPaginate
                  breakLabel="..."
                  nextLabel="next >"
                  onPageChange={changePage}
                  pageRangeDisplayed={pageCount}
                  containerClassName="pagination"
                  pageLinkClassName="page-num"
                  activeClassName="active"
                  pageCount={pageCount}
                  marginPagesDisplayed={2}
                  previousLabel="< previous"
                  renderOnZeroPageCount={null}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
