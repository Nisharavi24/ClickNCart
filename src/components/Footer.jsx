import React from "react";
import "../styles/footer.css";
import { FaFacebook, FaWhatsapp, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-titles">
          <h1>JERAPHIC TECHNOLOGIES</h1>
          <h3>Smart IT Solutions</h3>
        </div>


        <div className="footer-address">
          <FaMapMarkerAlt className="footer-icon" />
          <p>
            742 A, 2nd A Cross Rd,<br />
            PNS Layout, HRBR Layout,<br />
            Kalyan Nagar, Bengaluru,<br />
            Karnataka 560043
          </p>
        </div>


        <div className="footer-links">
          <h4>Policies</h4>
          <ul>
            <li><a href="/terms">Terms of Service</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/return">Return Policy</a></li>
          </ul>
        </div>


        <div className="footer-links">
          <h4>Explore</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/products">Products</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>


        <div className="footer-icons">
          <a
            href="https://wa.me/919901450558"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp />
          </a>


          <a
            href="https://www.facebook.com/www.jeraphictechnologies.in"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook />
          </a>


          <a href="tel:+919901450558">
            <FaPhoneAlt />
          </a>
        </div>
      </div>


      <div className="footer-bottom">
        © {new Date().getFullYear()} JERAPHIC TECHNOLOGIES
      </div>
    </footer>
  );
};


export default footer;
