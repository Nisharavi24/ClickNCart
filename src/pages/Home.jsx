import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import "../styles/home.css";




import { FaLaptop, FaDollarSign, FaBolt, FaUserTie } from "react-icons/fa";





function Home() {
  const navigate = useNavigate();




  const products = [
  {
    id: 1,
    name: "Refurbished Laptop",
    price: "₹15,000",
    type: "Rent & Sale",
    img: "/laptop.png",
  },
  {
    id: 2,
    name: "Refurbished Printer",
    price: "₹9,500",
    type: "Rent & Sale",
    img: "/printer.png",
  },
  {
    id: 3,
    name: "Refurbished Laptop Pro",
    price: "₹18,000",
    type: "Rent & Sale",
    img: "/laptop2.png",
  },
  {
    id: 4,
    name: "Refurbished Printer XL",
    price: "₹12,500",
    type: "Rent & Sale",
    img: "/printer2.jpg",
  },
];



  /* ================= WHY CHOOSE US ================= */
  const whyChooseUs = [
    {
      id: 1,
      title: "High Quality",
      description:
        "Refurbished laptops & printers tested for best performance.",
      icon: <FaLaptop size={30} color="#00796B" />,
      bgColor: "#E0F7FA",
    },
    {
      id: 2,
      title: "Affordable Prices",
      description:
        "Rent or buy products at prices that perfectly fit your budget.",
      icon: <FaDollarSign size={30} color="#F57C00" />,
      bgColor: "#FFF3E0",
    },
    {
      id: 3,
      title: "Fast Service",
      description:
        "Quick delivery and on-time technical support for customers.",
      icon: <FaBolt size={30} color="#33691E" />,
      bgColor: "#F1F8E9",
    },
    {
      id: 4,
      title: "Trusted Team",
      description:
        "Experienced professionals providing reliable IT solutions.",
      icon: <FaUserTie size={30} color="#C2185B" />,
      bgColor: "#FCE4EC",
    },
  ];




  /* ================= SLIDER ================= */
  const [current, setCurrent] = useState(0);




  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % products.length);
    }, 4000);




    return () => clearInterval(interval);
  }, [products.length]);




  return (
    <Layout>




      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="floating-logo">
          <img src="/logo.png" alt="Jeraphic Logo" />
        </div>




        <div className="hero-content">
          <h1>
            Smart IT <span>Solutions</span>
          </h1>




          <p className="tagline">
            Laptops • Printers • Rentals • Services
          </p>




          <button
            className="login-btn"
            onClick={() => navigate("/login/user")}
          >
            Login Now
          </button>
        </div>
      </section>




      {/* ================= PRODUCTS SLIDER ================= */}
      <section className="product-slider">
        <h2>Our Products</h2>




        <div className="slider-container">
          {products.map((product, index) => (
            <div
              key={product.id}
              className={`slide ${index === current ? "active" : ""}`}
            >
              <img src={product.img} alt={product.name} />
              <h3>{product.name}</h3>
              <p className="price">{product.price}</p>
              <p className="type">{product.type}</p>
            </div>
          ))}
        </div>
      </section>




      {/* ================= WHY CHOOSE US ================= */}
      <section className="why-choose-us">
        <h2>Why Choose Us?</h2>




        <div className="choose-us-cards">
          {whyChooseUs.map((item) => (
            <div
              key={item.id}
              className="card"
              style={{ backgroundColor: item.bgColor }}
            >
              <div className="icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>




    </Layout>
  );
}




export default Home;
