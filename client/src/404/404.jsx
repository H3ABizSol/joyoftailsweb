import React from "react";
import errorPage from "../Asset/error.jpeg";

export const Error = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "85vh",
        margin: "auto",
        position: "relative",
      }}
    >
      <img src={errorPage} alt="" width={"100%"} height={"100%"} />
      <button
        style={{
          backgroundColor: "rgb(74, 185, 74)",
          border: "none",
          padding: "0.6rem 2rem",
          color: "white",
          borderRadius: "20px",
          position: "absolute",
          left: "45%",
          top: "45%",
          cursor: "pointer",
        }}
      >
        Go Back
      </button>
    </div>
  );
};
