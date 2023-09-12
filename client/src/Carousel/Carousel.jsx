import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { motion } from "framer-motion";
import "./Carousel.css";

export const MyCarousel = ({
  images,
  desktop,
  mobile,
  arrow,
  dots,
  countslide,
}) => {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: desktop,
      slidesToSlide: countslide,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: desktop,
      slidesToSlide: countslide,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: mobile,
      slidesToSlide: mobile,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: mobile,
      slidesToSlide: mobile,
    },
  };
  return (
    <>
      <Carousel
        responsive={responsive}
        swipeable={true}
        draggable={true}
        showDots={dots}
        infinite={true}
        arrows={arrow}
        autoPlay={true}
        autoPlaySpeed={6000}
        className="carousel"
      >
        {images.length > 0 &&
          images.map((img, index) => {
            return (
              <motion.div key={img.key} className="carousel-container">
                <figure>
                  <img src={`/uploads/${img}`} alt={img.imgName} />
                </figure>
              </motion.div>
            );
          })}
      </Carousel>
    </>
  );
};
