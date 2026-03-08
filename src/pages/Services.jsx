import "../styles/services.css";

function Services() {
  return (
    <div className="services-hero">
      <div className="services-content">
        <h1>
          Our <span>Services</span>
        </h1>
        <p>Reliable support for printers, laptops and IT solutions</p>

        <div className="services-container">
          <div className="service-card">Printer Repair</div>
          <div className="service-card">Laptop Servicing</div>
          <div className="service-card">Installation & Setup</div>
        </div>
      </div>
    </div>
  );
}

export default Services;


