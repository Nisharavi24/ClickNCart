import React from "react";
import Layout from "../components/Layout";
import "../styles/about.css";




const aboutCards = [
  { id: 1, title: "Our Mission", description: "Providing smart IT solutions including laptops, printers, rentals, and services with trust and reliability.", img: "/mission.png" },
  { id: 2, title: "Our Vision", description: "To become the most trusted IT partner in Bengaluru, delivering innovative and affordable technology solutions.", img: "/vision.png" },
  { id: 3, title: "Our Values", description: "Customer satisfaction, honesty, quality, and innovation are at the core of everything we do.", img: "/values.png" },
  { id: 4, title: "Our Services", description: "We offer laptops and printers on rent or sale, installation services, maintenance, and IT consultancy.", img: "/services.png" },
];




function About() {
  return (
    <Layout>
      <section className="about-hero">
        <div className="hero-content">
          <h1>About Us</h1>
          <p>Jeraphic Technologies is your one-stop shop for smart IT solutions in Bengaluru.</p>
        </div>
      </section>
















      <section className="about-cards">
        <h2>Who We Are</h2>
        <div className="cards-container">
          {aboutCards.map(card => (
            <div key={card.id} className="about-card">
              <div className="card-img"><img src={card.img} alt={card.title} /></div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}

export default About;
