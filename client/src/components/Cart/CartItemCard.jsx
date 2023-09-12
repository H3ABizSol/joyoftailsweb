import React from "react";
import "./CartItemCard.css";
import { Link } from "react-router-dom";
import axios from "axios";

const CartItemCard = ({ item, cartId, deleteCartItems }) => {
  return (
    <div className="CartItemCard">
      <img src={`/uploads/${item.img[0]}`} alt="ssa" />
      <div>
        <Link to={`/product/${item._id}`}>{item.name}</Link>
        <span>{`Price: ₹${item.price}`}</span>
        <p onClick={() => deleteCartItems(cartId, item.productId, item)}>
          Remove
        </p>
      </div>
    </div>
  );
};

export default CartItemCard;
