import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/service.css";




import { db, auth } from "../../firebase/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
  where
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";




function ManageServices() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    product: "",
    date: ""
  });




  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        alert("Please login first");
        window.location.href = "/login";
        return;
      }




      try {
        const userQuery = query(
          collection(db, "users"),
          where("authUid", "==", currentUser.uid)
        );




        const userSnapshot = await getDocs(userQuery);




        if (userSnapshot.empty) {
          alert("Access denied. Admin only.");
          window.location.href = "/";
          return;
        }




        const userData = userSnapshot.docs[0].data();




        if (userData.isAdmin !== true) {
          alert("Access denied. Admin only.");
          window.location.href = "/";
          return;
        }




        const serviceQuery = query(
          collection(db, "services"),
          orderBy("serviceId", "desc")
        );




        const snapshot = await getDocs(serviceQuery);




        const serviceList = snapshot.docs.map((docSnap, index) => ({
          docId: docSnap.id,
          serviceId:
            docSnap.data().serviceId ||
            `SER-2026-${String(index + 1).padStart(3, "0")}`,
          status: docSnap.data().status || "Pending",
          ...docSnap.data(),
        }));




        setServices(serviceList);
        setFilteredServices(serviceList);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    });




    return () => unsub();
  }, []);




  const toggleStatus = async (docId, currentStatus) => {
    const newStatus =
      currentStatus === "Pending" ? "Completed" : "Pending";




    try {
      const serviceRef = doc(db, "services", docId);
      await updateDoc(serviceRef, { status: newStatus });




      setServices((prev) =>
        prev.map((s) =>
          s.docId === docId ? { ...s, status: newStatus } : s
        )
      );




      setFilteredServices((prev) =>
        prev.map((s) =>
          s.docId === docId ? { ...s, status: newStatus } : s
        )
      );




      alert(`Status changed to ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };




  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);




    let filtered = [...services];




    if (newFilters.status)
      filtered = filtered.filter(
        (s) => s.status === newFilters.status
      );




    if (newFilters.product)
      filtered = filtered.filter(
        (s) => s.product === newFilters.product
      );




    if (newFilters.date)
      filtered = filtered.filter(
        (s) => s.preferredDate === newFilters.date
      );




    setFilteredServices(filtered);
  };




  const exportCSV = () => {
    const csvHeader = [
      "Name",
      "Email",
      "Product",
      "Issue",
      "Date",
      "Additional Info",
      "Service ID",
      "Status"
    ];




    const csvRows = filteredServices.map((s) => [
      s.name,
      s.email,
      s.product,
      s.issueType === "Other" ? s.otherIssue : s.issueType,
      s.preferredDate,
      s.additionalInfo || "-",
      s.serviceId,
      s.status,
    ]);




    const csvContent = [csvHeader, ...csvRows]
      .map((e) => e.join(","))
      .join("\n");




    const blob = new Blob([csvContent], {
      type: "text/csv",
    });




    const url = URL.createObjectURL(blob);




    const a = document.createElement("a");
    a.href = url;
    a.download = "services.csv";
    a.click();
    URL.revokeObjectURL(url);
  };




  return (
    <>
      <Navbar />




      <div className="service-page">
        <div className="service-container">




          {/* BACK TO DASHBOARD BUTTON */}
          <button
            className="admin-back-btn"
            onClick={() => window.history.back()}
            style={{ marginBottom: "20px" }}
          >
            ← Back to Dashboard
          </button>




          <div className="service-header">
            <h1>Manage <span>Services</span></h1>
            <p>Admin panel to manage all service requests</p>
          </div>




          <div className="admin-box">
            <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
              <select name="status" value={filters.status} onChange={handleFilterChange}>
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>




              <select name="product" value={filters.product} onChange={handleFilterChange}>
                <option value="">All Products</option>
                <option value="Laptop">Laptop</option>
                <option value="Printer">Printer</option>
              </select>




              <input
                type="date"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
              />




              <button className="service-btn small" onClick={exportCSV}>
                Export CSV
              </button>
            </div>




            {loading ? (
              <div className="loader"></div>
            ) : filteredServices.length === 0 ? (
              <p>No services found</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Service ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Product</th>
                    <th>Issue</th>
                    <th>Date</th>
                    <th>Additional Info</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServices.map((service) => (
                    <tr key={service.docId}>
                      <td>{service.serviceId}</td>
                      <td>{service.name}</td>
                      <td>{service.email}</td>
                      <td>{service.product}</td>
                      <td>
                        {service.issueType === "Other"
                          ? service.otherIssue
                          : service.issueType}
                      </td>
                      <td>{service.preferredDate}</td>
                      <td>{service.additionalInfo || "-"}</td>
                      <td>
                        <span className={`status ${service.status.toLowerCase()}`}>
                          {service.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="service-btn small"
                          onClick={() =>
                            toggleStatus(service.docId, service.status)
                          }
                        >
                          Toggle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>




        </div>
      </div>


    </>
  );
}




export default ManageServices;
// just remove the footer
//don't change the entire code
