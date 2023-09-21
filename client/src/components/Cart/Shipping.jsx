import React, { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import "./Shipping.css";
// import { useSelector, useDispatch } from "react-redux";
// import { saveShippingInfo } from "../../actions/cartAction";
// import MetaData from "../layout/MetaData";
// import PinDropIcon from "@material-ui/icons/PinDrop";
// import HomeIcon from "@material-ui/icons/Home";
// import LocationOnIcon from "@mui/icons-material/LocationOn";
// import LocationCityIcon from "@material-ui/icons/LocationCity";
// import PublicIcon from "@material-ui/icons/Public";
// import PhoneIcon from "@material-ui/icons/Phone";
// import TransferWithinAStationIcon from "@material-ui/icons/TransferWithinAStation";
import { Country, State } from "country-state-city";
// import { useAlert } from "react-alert";
import CheckoutSteps from "./CheckoutSteps";
import { Navigate, useLocation } from "react-router-dom";
import { AddShipping } from "../../Store/ShipingSlice/ShipingSlice";

const Shipping = () => {
  const dispatch = useDispatch();
  // const alert = useAlert();
  // const { shippingInfo } = useSelector((state) => state.cart);

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [landmark, setLandmark] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [name, setName] = useState("");

  console.log(state);
  // const history = useHistory();
  const location = useLocation();
  const shippingSubmit = (e) => {
    e.preventDefault();
    dispatch(
      AddShipping({
        name,
        address,
        city,
        state,
        country: "India",
        pinCode,
        phoneNo,
        landmark,
      })
    );

    if (phoneNo.length < 10 || phoneNo.length > 10) {
      return;
    }
    // dispatch(
    //   saveShippingInfo({ address, city, state, country, pinCode, phoneNo })
    // );
    // history.push("/order/confirm");
    // Navigate("/order/confirm");
    console.log(location);
    const newUrl = `/order/confirm`;
    window.location.assign(newUrl);
  };

  return (
    <Fragment>
      {/* <MetaData title="Shipping Details" /> */}

      <div className="shippingContainer">
        <div className="shippingBox">
          <h2 className="shippingHeading">Shipping Details</h2>

          <form
            className="shippingForm"
            encType="multipart/form-data"
            onSubmit={shippingSubmit}
          >
            <div>
              {/* <HomeIcon /> */}
              <input
                type="text"
                placeholder="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              {/* <HomeIcon /> */}
              <input
                type="text"
                placeholder="Address"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div>
              {/* <LocationOnIcon /> */}
              <input
                type="text"
                placeholder="City"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div>
              {/*landmark/> */}
              <input
                type="text"
                placeholder="landmark"
                required
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
              />
            </div>

            <div>
              {/* <PinDropIcon /> */}
              <input
                type="number"
                placeholder="Pin Code"
                required
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
              />
            </div>

            <div>
              {/* <PhoneIcon /> */}
              <input
                type="number"
                placeholder="Phone Number"
                required
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                size="10"
              />
            </div>

            <div>
              {/* <PublicIcon /> */}

              <select required value={"India"}>
                <option value="India" selected>
                  India
                </option>
              </select>
            </div>

            <div>
              <select
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
              >
                {State &&
                  State.getStatesOfCountry("IN").map((item) => (
                    <option key={item.isoCode} value={item.isoCode}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>

            <input
              type="submit"
              value="Continue"
              className="shippingBtn"
              disabled={state ? false : true}
            />
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default Shipping;
