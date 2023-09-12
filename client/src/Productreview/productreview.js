import React from "react";
import { Rating } from "react-simple-star-rating";
import "./review.css";

export const Productreview = ({ product }) => {
  console.log(product);
  return (
    <div className="review-wrapper">
      <h2>Product Reviews</h2>
      <div className="review-container">
        {product.reviews &&
          product.reviews.map((p) => {
            return (
              <div>
                <div className="review-items">
                  <div>
                    <p>{p.name}</p>
                  </div>
                  <div>
                    <Rating
                      readonly
                      initialValue={p.rating}
                      size={20}
                      allowFraction={true}
                    />
                  </div>
                  <div>
                    <p>{p.comment}</p>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
