import React from "react";
import "../Footer/Footer.css";
import {
  IoLogoGooglePlaystore,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";
import { TbTruckReturn } from "react-icons/tb";
import { BsRocketTakeoff, BsWhatsapp } from "react-icons/bs";
import { SlSupport } from "react-icons/sl";
import {
  AiFillApple,
  AiFillInstagram,
  AiFillTwitterSquare,
  AiFillFacebook,
  AiFillYoutube,
} from "react-icons/ai";

export const Footer = () => {
  return (
    <footer>
      <div className="footer-section">
        <div className="footer-grid">
          <h4>Online Shopping</h4>
          <ul className="footer-list">
            <li>Dogs</li>
            <li>Cats</li>
            <li>Small Animal</li>
            <li>Personalised Items</li>
            <li>HUFT Blog</li>
          </ul>
        </div>

        <div className="footer-grid">
          <h4>Quick Links</h4>
          <ul className="footer-list">
            <li>Contact Us</li>
            <li>Track your Orders</li>
            <li>FAQs & Exchange Policy</li>
            <li>Terms Of Use</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        <div className="footer-grid">
          <h4>Explore</h4>
          <ul className="footer-list">
            <li>About Us</li>
            <li>Careers</li>
            <li>Awards</li>
            <li>Store Locator</li>
            <li>Birthdaay Club</li>
          </ul>
        </div>

        {/* <div className="footer-grid">
          <h4>Download HUFT App</h4>
          <div className="footer-app">
            <div className="footer-download-app">
              <IoLogoGooglePlaystore style={{ fontSize: "3.6rem" }} />
              <div>
                <p>Get it on</p>
                <h3>Google Play</h3>
              </div>
            </div>

            <div className="footer-download-app">
              <AiFillApple style={{ fontSize: "3.6rem" }} />
              <div>
                <p>Download on the</p>
                <h3>App store</h3>
              </div>
            </div>
          </div>
          <div className="footer-mail">
            <h4>LEAVE YOUR EMAIL AND GET OFFERS</h4>
            <div style={{ display: "flex" }}>
              <input
                type="text"
                value="https://apps.apple.com/in/app/heads-up-for-tails/id1643657088"
                readOnly
                style={{ flex: 2 }}
              />
              <button>Send</button>
            </div>
            <p>
              Pets are at the heart of everything we do here, they make our
              lives whole. With each collection, we do our best to honour them.
              Subscribe to our Newsletter and receive special promotions and
              insider information about upcoming collections.
            </p>
          </div>
        </div> */}
      </div>
      <hr />
      <div className="footertwo-list">
        <div className="footertwo-list-container">
          <BsRocketTakeoff style={{ fontSize: "2.2rem" }} />
          <div>
            <h2>Free Shipping</h2>
            <p>On all orders above ₹799</p>
          </div>
        </div>

        <div className="footertwo-list-container">
          <TbTruckReturn style={{ fontSize: "2.2rem" }} />
          <div>
            <h2>Free Returns</h2>
            <p>Within 7 days(T&Cs Apply)</p>
          </div>
        </div>
        <div className="footertwo-list-container">
          <IoShieldCheckmarkOutline style={{ fontSize: "2.2rem" }} />
          <div>
            <h2>Best Products</h2>
            <p>On Pet Products</p>
          </div>
        </div>
        <div className="footertwo-list-container">
          <SlSupport style={{ fontSize: "2.2rem" }} />
          <div>
            <h2>We Support</h2>
            <p>7days,9am to 9pm</p>
          </div>
        </div>
      </div>
      <hr style={{ marginTop: "5rem" }} />

      <p
        style={{
          marginTop: "2rem",
          fontSize: "1.4rem",
          padding: "0 0.8rem",
          color: "gray",
          lineHeight: "2.3rem",
          fontFamily: "sans-serif",
        }}
      >
        <span style={{ color: "white", fontSize: "1.5rem", fontWeight: "600" }}>
          POPULAR SEARCHES
        </span>
        &nbsp; Leashes & Harnesses | Dog Food | Treats, Biscuits and Chews |
        Royal Canin | Name Tags | Harnesses | Beds | Toys | HUFT Offers | Dog
        Clothes | Royal Canin Dog Food | Dog Accessories | Dry Dog Food |
        Collars and Leashes | Cat Products | Dog Grooming | Dog Bedding | Dog
        Bowls | Dog T-shirts & Shirts | Personalised Collars | Dog Collars |
        Chew Toys | Dog Bandanas | Dog Products | Pedigree | Farmina | Dog Party
        Wear | Cat Food | Cat Litter & Accessories | Puppy Food | Dog Shoes &
        Socks | Dog Brushes & Combs | Interactive Toys | Furniture & Scratchers
        | Cat Toys | Shampoos & Conditioners | Bow Ties | Crates & Carriers |
        Pet Mats
      </p>

      <p
        style={{
          marginTop: "2rem",
          fontSize: "1.4rem",
          padding: "0 1rem",
          color: "gray",
          lineHeight: "2.3rem",
          fontFamily: "sans-serif",
        }}
      >
        HEAD OFFICE ADDRESS Earth Paws Private Limited, First Floor, Plot No.
        34, Institutional Area, Sector-32, Gurugram, Haryana-122001
      </p>
      <hr style={{ marginTop: "3rem" }} />

      <div className="footer-last">
        <p>© 2023, Earth Paws Private Limited. All Rights Reserved.</p>
        <div className="social-media">
          <AiFillTwitterSquare
            style={{
              fontSize: "4rem",
              width: "65px",
              padding: "1rem 2rem",
              height: "65px",
              borderRadius: "50%",
              backgroundColor: "rgb(244, 220, 214)",
              color: "black",
            }}
          />
          <AiFillFacebook
            style={{
              fontSize: "4rem",
              width: "65px",
              padding: "1rem 2rem",
              height: "65px",
              borderRadius: "50%",
              backgroundColor: "rgb(244, 220, 214)",

              color: "black",
            }}
          />
          <AiFillInstagram
            style={{
              fontSize: "4rem",
              width: "65px",
              padding: "1rem 2rem",
              height: "65px",
              borderRadius: "50%",
              backgroundColor: "rgb(244, 220, 214)",

              color: "black",
            }}
          />
          <AiFillYoutube
            style={{
              fontSize: "4rem",
              width: "65px",
              padding: "1rem 2rem",
              height: "65px",
              borderRadius: "50%",
              backgroundColor: "rgb(244, 220, 214)",

              color: "black",
            }}
          />
        </div>
      </div>
      <div className="whatsapp">
        <a
          href="https://wa.me/+917497042180"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.4rem",
            alignItems: "center",
          }}
        >
          <BsWhatsapp size={50} fill="#25D366" />
          <span
            style={{
              fontSize: "1rem",
              fontWeight: "700",
              color: "#5d625e",
              textTransform: "uppercase",
              letterSpacing: "0.2rem",
            }}
          >
            Chat With Us
          </span>
        </a>
      </div>
    </footer>
  );
};
