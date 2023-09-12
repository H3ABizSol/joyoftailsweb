import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { Header } from "./components/Header/Header";
import { Footer } from "./components/Footer/Footer";
import { Dashboard } from "./Dashboard/Dashboard";
import { Order } from "./Dashboard/Order";
import Login from "./components/Login/Login";
import Cart from "./components/Cart/Cart";
import { Privateroute } from "./Privateroute/Privateroute";
import { Error } from "./404/404";
import Register from "./components/Register/Register";
import { Edit } from "./Edit/Edit";
import Shipping from "./components/Cart/Shipping";
import ConfirmOrder from "./components/Cart/ConfirmOrder";
import { Persional } from "./Profile/Persionalinfo/Persional";
import { Userorder } from "./Profile/Order/Userorder";
import { User } from "./Dashboard/User";
import { Admin } from "./Dashboard/Admin";
import { Featured } from "./Dashboard/Featured";
import PaymentSuccess from "./PaymentSuccess/PaymentSuccess";
import ForgotPassword from "./ForgotPassword/ForgotPassword";
import ResetPassword from "./ResetPassword/ResetPassword";
import { Home } from "./Home/Home";
import { Products } from "./products/Products";
import { Productdetails } from "./Productsdetails/Productsdetails";
import { Service } from "./Dashboard/sevice";
import { Ourservice } from "./components/service/service";
import { useEffect } from "react";
import axios from "axios";
import { Category } from "./Dashboard/category";
import { SubCategory } from "./Dashboard/subcategory";
import { Brand } from "./Dashboard/brand";
import { Orderdetails } from "./Profile/Orderdetails/Orderdetails";
import { Information } from "./Dashboard/inormation";
import { Coupon } from "./Dashboard/coupon";
import { Loginphone } from "./components/Login/Loginphone";
import { HappyCustomer } from "./Dashboard/happycustomer";
import { Blog } from "./Dashboard/blog";
import { UserBlog } from "./Blog/Blog";
import { Blogdetails } from "./Blogdetails/Blogdetails";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/loginphone" element={<Loginphone />} />

          <Route path="/password/forgot" element={<ForgotPassword />} />
          <Route path="/password/reset/:token" element={<ResetPassword />} />
          <Route
            path="/*"
            element={
              <>
                <Header />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/allblogs" element={<UserBlog />} />
                  <Route path="/blogdetails/:id" element={<Blogdetails />} />
                  <Route path="dashboard" element={<Privateroute />}>
                    <Route path="" element={<Admin />} />
                    <Route path="products" element={<Dashboard />} />
                    <Route path="order" element={<Order />} />
                    <Route path="user" element={<User />} />
                    <Route path="feature" element={<Featured />} />
                    <Route path="service" element={<Service />} />
                    <Route path="categories" element={<Category />} />
                    <Route path="subcategories" element={<SubCategory />} />
                    <Route path="brand" element={<Brand />} />
                    <Route path="information" element={<Information />} />
                    <Route path="information" element={<Information />} />
                    <Route path="coupon" element={<Coupon />} />
                    <Route path="happycustomer" element={<HappyCustomer />} />
                    <Route path="blogs" element={<Blog />} />
                  </Route>
                  <Route path="/products/:name" element={<Products />} />
                  <Route
                    path="/productsdetails/:id"
                    element={<Productdetails />}
                  />
                  <Route path="/edit/:id" element={<Edit />} />
                  <Route path="/service/:name" element={<Ourservice />} />

                  <Route path="/cart" element={<Cart />} />
                  <Route path="/shipping" element={<Shipping />} />
                  <Route path="/order/confirm" element={<ConfirmOrder />} />
                  <Route path="/profile" element={<Persional />} />
                  <Route path="/orderdetails/:id" element={<Orderdetails />} />

                  <Route path="/userorder" element={<Userorder />} />
                  <Route path="/paymentsuccess" element={<PaymentSuccess />} />
                  <Route path="*" element={<Error />} />
                </Routes>

                <Footer />
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
