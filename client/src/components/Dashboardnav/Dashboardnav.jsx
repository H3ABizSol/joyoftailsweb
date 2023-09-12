import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { TbLayoutDashboard } from "react-icons/tb";
import {
  MdOutlineProductionQuantityLimits,
  MdOutlineBorderColor,
  MdOutlineCategory,
  MdOutlineDescription,
} from "react-icons/md";
import { BiUserCircle, BiDownArrow } from "react-icons/bi";
import { SiBrandfolder } from "react-icons/si";
import { GrServices, GrCircleInformation } from "react-icons/gr";
import { RiCoupon4Line } from "react-icons/ri";
import { PiFlagBanner } from "react-icons/pi";

export const Dashboardnav = () => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <ul className={show ? "ul show" : "ul"}>
        <Link to="/dashboard" className="links">
          <li>
            <TbLayoutDashboard />
            Dashboard
          </li>
        </Link>
        <NavLink to="/dashboard/products" className="links">
          <li>
            <MdOutlineProductionQuantityLimits />
            Products
          </li>
        </NavLink>
        <NavLink to="/dashboard/service" className="links">
          <li>
            <GrServices />
            Our Service
          </li>
        </NavLink>{" "}
        <NavLink to="/dashboard/categories" className="links">
          <li>
            <MdOutlineCategory />
            Category
          </li>
        </NavLink>{" "}
        <NavLink to="/dashboard/subcategories" className="links">
          <li>
            <MdOutlineDescription />
            Sub Category
          </li>
        </NavLink>{" "}
        <NavLink to="/dashboard/blogs" className="links">
          <li>
            <MdOutlineCategory />
            Blogs
          </li>
        </NavLink>{" "}
        <NavLink to="/dashboard/brand" className="links">
          <li>
            <SiBrandfolder />
            Brand
          </li>
        </NavLink>
        <NavLink to="/dashboard/order" className="links">
          <li>
            <MdOutlineBorderColor />
            Orders
          </li>
        </NavLink>{" "}
        <NavLink to="/dashboard/user" className="links">
          <li>
            <BiUserCircle />
            Users
          </li>
        </NavLink>{" "}
        <NavLink to="/dashboard/feature" className="links">
          <li>
            <PiFlagBanner />
            Banner
          </li>
        </NavLink>
        <NavLink to="/dashboard/information" className="links">
          <li>
            <GrCircleInformation />
            Information
          </li>
        </NavLink>
        <NavLink to="/dashboard/coupon" className="links">
          <li>
            <RiCoupon4Line />
            Discount Info
          </li>
        </NavLink>
        <NavLink to="/dashboard/happycustomer" className="links">
          <li>
            <RiCoupon4Line />
            Happy Customer
          </li>
        </NavLink>
      </ul>
      <div
        style={{ textAlign: "end" }}
        className={"hidearrow"}
        onClick={() => {
          setShow(!show);
        }}
      >
        <BiDownArrow size={20} fill="tomato" />
      </div>
    </div>
  );
};
