import React, { useState } from "react";
import Layout from "../components/Layout";
import "../styles/faq.css";
import { FaChevronDown } from "react-icons/fa";




function FAQ() {
  const faqList = [
    {
      question: "How can I order a printer?",
      answer: "You can order a printer by browsing our 'Products' section, adding the desired printer to your cart, and completing the checkout process. You can also contact us for bulk orders or special requests.",
    },
    {
      question: "What is the delivery time?",
      answer: "Delivery usually takes 3-5 business days within Bengaluru. For other locations, delivery may take up to 7-10 days depending on the shipping method.",
    },
    {
      question: "Do you offer installation services?",
      answer: "Yes, we provide installation and setup services for all laptops and printers purchased or rented from us. Our team will contact you to schedule a convenient time.",
    },
    {
      question: "Can I return or cancel an order?",
      answer: "Orders can be cancelled within 24 hours of purchase. Returns are accepted within 7 days of delivery if the product is in original condition and packaging. Please contact customer support for assistance.",
    },
    {
      question: "Is GST included in the price?",
      answer: "Yes, all prices listed on our website include GST. You will receive an official invoice for every purchase or rental transaction.",
    },
  ];




  const [activeIndex, setActiveIndex] = useState(null);




  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };




  return (
    <Layout>
      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-container">
          {faqList.map((item, i) => (
            <div
              key={i}
              className={`faq-card ${activeIndex === i ? "active" : ""}`}
            >
              <div className="faq-question" onClick={() => toggleFAQ(i)}>
                <span>{item.question}</span>
                <FaChevronDown className="faq-icon" />
              </div>
              <div className="faq-answer">{item.answer}</div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}




export default FAQ;
