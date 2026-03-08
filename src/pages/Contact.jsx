import React from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from "react-icons/fa";
import Layout from "../components/Layout";
import "../styles/contact.css";


function Contact() {
  return (
    <Layout>
      <section className="contact-section">
        <h2 className="contact-title">Contact Us</h2>


        <div className="contact-card">
          {/* LEFT SIDE - INFO */}
          <div className="contact-left">
            <h3>Get in Touch</h3>
            <p>
              Have questions or need assistance? Our team is ready to help you
              with IT solutions, rentals, and products.
            </p>


            <div className="contact-item">
              <FaPhoneAlt />
              <span>+91 9901450558</span>
            </div>


            <div className="contact-item">
              <FaEnvelope />
              <span>technologiesjeraphic@gmail.com</span>
            </div>


            <div className="contact-item">
              <FaMapMarkerAlt />
              <span>
                742 A, 2nd A Cross Rd, PNS Layout, HRBR Layout,
                Kalyan Nagar, Bengaluru, Karnataka 560043
              </span>
            </div>
          </div>


          {/* RIGHT SIDE - MAP */}
          <div className="contact-right">
            <h4>Our Location</h4>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.123456789!2d77.633!3d13.016!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae4c5c7d12345%3A0xabcdef1234567890!2s742%20A%2C%202nd%20A%20Cross%20Rd%2C%20PNS%20Layout%2C%20HRBR%20Layout%2C%20Kalyan%20Nagar%2C%20Bengaluru%2C%20Karnataka%20560043!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin"
              allowFullScreen=""
              loading="lazy"
              title="Jeraphic Location"
            ></iframe>
          </div>
        </div>


        {/* WhatsApp Floating Button */}
        <a
          href="https://wa.me/919901450558"
          target="_blank"
          rel="noreferrer"
          className="whatsapp-float"
        >
          <FaWhatsapp />
        </a>
      </section>
    </Layout>
  );
}


export default Contact;
