import React, { Fragment } from "react";
// import { Typography, Stepper, StepLabel, Step } from "@material-ui/core";
// import LocalShippingIcon from "@material-ui/icons/LocalShipping";
// import LibraryAddCheckIcon from "@material-ui/icons/LibraryAddCheck";
// import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import "./CheckoutSteps.css";

const CheckoutSteps = ({ activeStep }) => {
  const steps = [
    {
      label: <div>Shipping Details</div>,
      //       icon: <LocalShippingIcon />,
    },
    {
      label: <div>Confirm Order</div>,
      //       icon: <LibraryAddCheckIcon />,
    },
    {
      label: <div>Payment</div>,
      //       icon: <AccountBalanceIcon />,
    },
  ];

  const stepStyles = {
    boxSizing: "border-box",
  };

  return (
    <Fragment>
      <div alternativeLabel activeStep={activeStep} style={stepStyles}>
        {steps.map((item, index) => (
          <div
            div
            key={index}
            active={activeStep === index ? true : false}
            completed={activeStep >= index ? true : false}
          >
            <div
              style={{
                color: activeStep >= index ? "tomato" : "rgba(0, 0, 0, 0.649)",
              }}
              icon={item.icon}
            >
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </Fragment>
  );
};

export default CheckoutSteps;
