import React from "react";
import Layout from "../components/Layout";
import { FaFacebookF, FaWhatsapp, FaEnvelope, FaPhone, FaClock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/contactUs.css";




function ContactUs() {
  const navigate = useNavigate();




  return (
    <Layout>
      <div className="contact-page">
        {/* Top Heading + Subtext */}
        <h2>Contact Us</h2>
        <p className="contact-subtext">
          We’re here to assist you. Reach out to us anytime.
        </p>




        {/* Contact Cards */}
        <div className="contact-cards">
          {/* Phone */}
          <div className="contact-card">
            <FaPhone className="contact-icon" />
            <span>
              <a href="tel:+919901450558">Customer Support : +91 9901450558</a>
            </span>
          </div>




          {/* Email */}
          <div className="contact-card">
            <FaEnvelope className="contact-icon" />
            <span>
              <a href="mailto:technologiesjeraphic@gmail.com">
                Email : technologiesjeraphic@gmail.com
              </a>
            </span>
          </div>




          {/* Facebook */}
          <div className="contact-card">
            <FaFacebookF className="contact-icon" />
            <span>
              <a
                href="https://www.facebook.com/www.jeraphictechnologies.in"
                target="_blank"
                rel="noreferrer"
              >
                Facebook : Jeraphic Technologies
              </a>
            </span>
          </div>




          {/* WhatsApp */}
          <div className="contact-card">
            <FaWhatsapp className="contact-icon" />
            <span>
              <a href="https://wa.me/919901450558" target="_blank" rel="noreferrer">
                WhatsApp : +91 9901450558
              </a>
            </span>
          </div>




          {/* Business Hours */}
          <div className="contact-card business-hours-card">
            <FaClock className="contact-icon" />
            <div>
              <h4>Business Hours</h4>
              <p>Mon – Sat : 09:30 AM – 08:00 PM</p>
              <p>Sun : Closed</p>
            </div>
          </div>
        </div>




        {/* Back Button */}
        <div className="back-btn-wrapper">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </Layout>
  );
}




export default ContactUs;
