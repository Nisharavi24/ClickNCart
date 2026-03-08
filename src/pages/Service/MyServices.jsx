import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/service.css";


import { db, auth } from "../../firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";


function MyServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [sortBy, setSortBy] = useState("date-desc");


  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        alert("Please login to see your services");
        window.location.href = "/login/user";
        return;
      }


      setUser(currentUser);
      setLoading(true);


      try {
        const q = query(
          collection(db, "services"),
          where("userId", "==", currentUser.uid)
        );


        const snapshot = await getDocs(q);


        const myServices = snapshot.docs.map((doc, index) => ({
          docId: doc.id,
          serviceId:
            doc.data().serviceId ||
            `SER-2026-${String(index + 1).padStart(3, "0")}`,
          status: doc.data().status || "Pending",
          ...doc.data(),
        }));


        setServices(myServices);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching my services:", error);
        setLoading(false);
      }
    });


    return () => unsub();
  }, []);


  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };


  const sortedServices = [...services].sort((a, b) => {
    if (sortBy === "date-asc")
      return a.preferredDate.localeCompare(b.preferredDate);
    if (sortBy === "date-desc")
      return b.preferredDate.localeCompare(a.preferredDate);
    return 0;
  });


  return (
    <>
      <Navbar />
      <div className="service-page">
        <div className="service-container">
          <div className="service-header">
            <h1>My <span>Services</span></h1>
            <p>Track your service requests</p>
          </div>

          {loading ? (
            <div className="loader"></div>
          ) : sortedServices.length === 0 ? (
            <p style={{ color: "#000" }}>
              No services found. Please raise a service request first.
            </p>
          ) : (
            <div className="service-list">
              {sortedServices.map((service) => (
                <div key={service.docId} className="service-card">
                  <h3>{service.product} Service</h3>
                  <p><strong>Service ID:</strong> {service.serviceId}</p>
                  <p><strong>Name:</strong> {service.name}</p>
                  <p>
                    <strong>Issue:</strong>{" "}
                    {service.issueType === "Other"
                      ? service.otherIssue
                      : service.issueType}
                  </p>
                  <p><strong>Date:</strong> {service.preferredDate}</p>
                  {service.additionalInfo && (
                    <p><strong>Info:</strong> {service.additionalInfo}</p>
                  )}
                  <span className={`status ${service.status.toLowerCase()}`}>
                    {service.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}


export default MyServices;