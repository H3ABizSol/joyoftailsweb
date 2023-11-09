import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { NavLink } from "react-router-dom";
import "./CustomerCarousel.css";
import { Rating } from "react-simple-star-rating";

export const CustomerCarousel = ({ data, arrows, dots, customerImages }) => {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 1,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };
  return (
    <>
      <Carousel
        responsive={responsive}
        arrows={arrows}
        showDots={dots}
        swipeable={true}
        draggable={true}
        autoPlay={true}
        autoPlaySpeed={6000}
        className="mycarousel"
      >
        {data.map((d, index) => {
          return (
            <div className="customer-wrapper">
              <figure>
                <img
                  src={
                    customerImages[index]
                      ? `uploads/${customerImages[index]}`
                      : "https://media.istockphoto.com/id/1331493599/photo/shot-of-a-businessman-using-a-computer-while-working-in-a-call-center.jpg?s=612x612&w=0&k=20&c=ocaFzVRnDARFnANjyd6CMrwAI0Ua6I0Na_MKej8IysA="
                  }
                  alt=""
                />
              </figure>
              <div className="customer-content">
                <h2 style={{ fontSize: "4.5rem", lineHeight: "7rem" }}>
                  Views Of Our Happy Customers
                </h2>
                <img src={`/uploads/${d.productImg}`} alt="" width={80} />
                <p>{d.productName}</p>
                <p>Comment :{d.comment[0]}</p>
                <Rating
                  initialValue={d.totalRating}
                  size={12}
                  readonly
                  allowFraction={true}
                />
                <h3>{d.username[0]}</h3>
                {/* <h3>Teacher</h3> */}
              </div>
            </div>
          );
        })}
      </Carousel>
    </>
  );
};
