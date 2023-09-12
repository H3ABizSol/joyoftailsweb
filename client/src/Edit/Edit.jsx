import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { Loader } from "../components/Loader/Loader";
import { ToastContainer, toast } from "react-toastify";

export const Edit = () => {
  const parms = useParams();
  const [open, setOpen] = useState(false);
  const [ok, setOK] = useState(false);
  const [Products, setProductsdet] = useState([]);
  const [sellingprice, setSelling] = useState(0);
  const [actualsellingprice, setActualSelling] = useState(0);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [subCategory2, setSubCategory2] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");
  const [image, setImage] = useState("");
  const [spin, setSpin] = useState(false);
  const [animalType, setAnimalType] = useState([]);
  const [animalTypeData, setAnimalTypeData] = useState("");

  const [formdata, setFormData] = useState({
    brand: "",
    title: "",
    desc: "",
    categories: "",
    subCategories: "",
    color: "",
    stock: "",
    price: "",
    foodType: "",
    animalType: "",
    gramPerQuantity: "",
    discount: 0,
    mrp: "",
  });

  const getProductsDetails = async () => {
    setSpin(true);
    const { data } = await axios.get(`/api/product/find/${parms.id}`);
    console.log(data);
    setImage(data.productDetails.img);
    const namearr = [];
    const pricearr = [];
    data.productDetails.gramPerQuantity.map((e) => {
      namearr.push(e.size);
      pricearr.push(e.price);
    });
    const size = namearr.toString();
    setFormData({
      brand: data.productDetails.brand,
      title: data.productDetails.title,
      desc: data.productDetails.desc,
      categories: data.productDetails.categories.category,
      subCategories: data.productDetails.categories.subCategory,
      color: data.productDetails.color,
      stock: data.productDetails.Stock,
      price: data.productDetails.price,
      foodType: data.productDetails.foodType,
      animalType: data.productDetails.animalType,
      gramPerQuantity: size,
      discount: data.productDetails.discount,
      mrp: data.productDetails.price,
    });
    setAnimalTypeData(data.productDetails.animalType);
    setCategoryName(data.productDetails.categories.category);
    setSubCategoryName(data.productDetails.categories.subCategory);
    setSpin(false);
  };

  const handleSubmit = async (e) => {
    setSpin(true);
    e.preventDefault();
    let formData = new FormData();
    for (let i = 0; i < image.length; i++) {
      formData.append("img", image[i]);
    }
    formData.append("title", formdata.title);
    formData.append("Stock", formdata.stock);
    formData.append("brand", formdata.brand);
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

    const { data } = await axios.put(`/api/product/${parms.id}`, formData, {
      headers: {
        token: Cookies.get("token"),
      },
    });
    setOpen(false);
    if (data.success) {
      setSpin(false);
      toast.success("Product updated successfully", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        fontSize: "50px",
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formdata,
      [e.target.name]: e.target.value,
    });
  };

  // const setcategorydata = (e) => {
  //   const filterData = subCategory.filter((c) => {
  //     return c.animalType.toLowerCase() === e.target.value.toLowerCase();
  //   });
  //   console.log(filterData);
  //   if (filterData.length > 0) {
  //     setCategory([...filterData]);
  //     // setSubCategoryName("All");
  //   } else {
  //     setSubCategory([]);
  //   }
  // };

  // const setsubcategorydata = (e) => {
  //   const filterData = subCategory.filter((c) => {
  //     return (
  //       c.animalType.toLowerCase() === animalTypeData.toLowerCase() &&
  //       c.title.toLowerCase() === e.target.value.toLowerCase()
  //     );
  //   });
  //   console.log(filterData);
  //   if (filterData[0].subCategories.length > 0) {
  //     setSubCategory2([...filterData[0].subCategories]);
  //   } else {
  //     setSubCategory2([]);
  //   }
  // };
  // const getSubCategory = async () => {
  //   console.log(categoryName);
  //   console.log(animalTypeData);
  //   const { data } = await axios.get("/api/subcategory", {
  //     headers: {
  //       token: localStorage.getItem("token"),
  //     },
  //   });
  //   console.log(data);
  //   if (data.success) {
  //     setAnimalType([
  //       ...new Set(
  //         data.subcategories.map((e) => {
  //           return e.animalType;
  //         })
  //       ),
  //     ]);
  //     // const filterData = data.subcategories.filter((c) => {
  //     //   // console.log(c);
  //     //   console.log(animalTypeData);
  //     //   if (
  //     //     c.animalType.toLowerCase() === formdata.animalType.toLowerCase() &&
  //     //     c.title.toLowerCase() === formdata.categories
  //     //   ) {
  //     //     console.log("hai");
  //     //   }
  //     // });
  //     // console.log(filterData);

  //     // setSubCategory2(filterData[0].subCategories);
  //     // setSubCategory2([...data.subcategories[0].subCategories]);
  //     // setSubCategory([...data.subcategories]);
  //     // setFormData({
  //     //   ...formdata,
  //     //   subCategories: data.subcategories[0].subCategories[0],
  //     // });
  //   }
  // };
  // const getCategory = async () => {
  //   const { data } = await axios.get("/api/category", {
  //     headers: {
  //       token: localStorage.getItem("token"),
  //     },
  //   });
  //   if (data.success) {
  //     const url = [];
  //     data.categories.map((c) => {
  //       const title = c.title.map((c) => {
  //         return url.push(c);
  //       });
  //     });
  //     setCategory([...url]);
  //   }
  // };

  useEffect(() => {
    getProductsDetails();
    // getCategory();
    // getSubCategory();
  }, []);
  console.log(formdata);
  return (
    <>
      <ToastContainer />
      {spin ? (
        <Loader />
      ) : (
        <div className="edit-wrapper">
          <form className="form-wrapper" onSubmit={handleSubmit} method="post">
            <h2>Edit Products</h2>
            <div className="form-content">
              <input
                type="text"
                name="brand"
                placeholder="product brand"
                onChange={handleChange}
                value={formdata.brand}
              />
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
                value={formdata.animalType}
                onChange={(e) => {
                  setAnimalTypeData(e.target.value);
                  // setcategorydata(e);
                  setFormData({
                    ...formdata,
                    animalType: e.target.value,
                  });
                }}
              >
                <option value={formdata.animalType}>
                  {formdata.animalType}
                </option>
                {/* {animalType &&
                  animalType.map((e) => {
                    return <option value={e}>{e}</option>;
                  })} */}
              </select>
              <select
                value={formdata.categories}
                className="common-select"
                onChange={(e) => {
                  setCategoryName(e.target.value);
                  // setsubcategorydata(e);
                  setFormData({
                    ...formdata,
                    categories: e.target.value,
                  });
                }}
              >
                <option value={formdata.categories}>
                  {formdata.categories}
                </option>
                {/* {category &&
                  category.map((c) => {
                    return <option value={c.name}>{c.name}</option>;
                  })} */}
              </select>

              <select
                value={subCategoryName}
                className="common-select"
                onChange={(e) => {
                  setSubCategoryName(e.target.value);
                  setFormData({
                    ...formdata,
                    subCategories: e.target.value,
                  });
                }}
              >
                <option value={formdata.subCategories}>
                  {formdata.subCategories}
                </option>
                {/* {subCategory2.length > 0 &&
                  subCategory2.map((c) => {
                    return <option value={c}>{c}</option>;
                  })} */}
              </select>
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
                placeholder="gramperquantity"
                onChange={handleChange}
                value={formdata.gramPerQuantity}
              />
              {/* <input
                  type="text"
                  name=""
                  id=""
                  style={{ width: "30%" }}
                  placeholder="price"
                /> */}

              <input
                type="text"
                name="foodType"
                placeholder="food type"
                onChange={handleChange}
                value={formdata.foodType}
              />
              <input
                type="file"
                multiple
                name="img"
                placeholder="product image"
                onChange={(e) => {
                  setImage(e.target.files);
                }}
              />

              {/* <button
                  type="button"
                  style={{ width: "30%" }}
                  onClick={addMore}
                >
                  Add More
                </button> */}
            </div>
            {/* {add.length > 0 &&
                add.map((e) => {
                  return (
                    <div
                      style={{
                        display: "flex",
                        gap: "1rem",
                        marginTop: "0.8rem",
                      }}
                    >
                      <input
                        type="text"
                        name="gramPerQuantity"
                        placeholder="gramperquantity"
                        onChange={handleChange}
                        value={formdata.gramperquantity}
                      />
                      <input
                        type="text"
                        name=""
                        id=""
                        style={{ width: "30%" }}
                        placeholder="price"
                      />
                    </div>
                  );
                })} */}

            <div className="form-content">
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
              <input
                type="text"
                name="color"
                placeholder="product color"
                onChange={handleChange}
                value={formdata.color}
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
        </div>
      )}
    </>
  );
};
