import React, { useEffect, useState, useRef } from "react";
import AdminLayout from "../components/AdminLayout";
import "../styles/adminReports.css";
import "../styles/adminUsers.css";


// Services
import { getAllUsers } from "../services/adminServices";
import { getRentals } from "../services/rentalServices";


// Firebase
import { db } from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";


// Charts
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";


// PDF / CSV
import jsPDF from "jspdf";
import html2canvas from "html2canvas";


function AdminReports() {
  const [reportType, setReportType] = useState("Users");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);


  // ✅ wrap both chart + table
  const pdfRef = useRef(null);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (reportType === "Users") {
          const users = await getAllUsers();
          setData(Array.isArray(users) ? users : []);
        }


        if (reportType === "Orders") {
          const snap = await getDocs(collection(db, "orders"));
          setData(
            snap.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          );
        }


        if (reportType === "Products") {
          const snap = await getDocs(collection(db, "products"));
          setData(
            snap.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          );
        }


        if (reportType === "Rentals") {
          const rentals = await getRentals();
          setData(Array.isArray(rentals) ? rentals : []);
        }
      } catch (err) {
        console.error(err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };


    fetchData();
  }, [reportType]);


  /* ================= GRAPH DATA ================= */
  const getChartData = () => {
    if (!data.length) return [];
    const map = {};
    if (reportType === "Users")
      data.forEach((u) => (map[u.role] = (map[u.role] || 0) + 1));
    if (reportType === "Products")
      data.forEach((p) => (map[p.category] = (map[p.category] || 0) + 1));
    if (reportType === "Rentals")
      data.forEach((r) => (map[r.status] = (map[r.status] || 0) + 1));


    return Object.keys(map).map((key) => ({ name: key, value: map[key] }));
  };


  const getOrderTrendData = () => {
    if (!data.length) return [];
    const map = {};
    data.forEach((o) => {
      const date = o.createdAt?.toDate
        ? o.createdAt.toDate().toLocaleDateString()
        : o.createdAt?.seconds
        ? new Date(o.createdAt.seconds * 1000).toLocaleDateString()
        : "Unknown";
      map[date] = (map[date] || 0) + 1;
    });
    return Object.keys(map).map((date) => ({ date, value: map[date] }));
  };


  /* ================= CSV ================= */
  const downloadCSV = () => {
    if (!data.length) return;


    let csv = "";
    if (reportType === "Users") {
      csv += "ID,Name,Email,Mobile,Role,Created At\n";
      data.forEach((u) => {
        csv += `${u.id},${u.firstName} ${u.lastName},${u.email},${
          u.mobile || "-"
        },${u.role},${
          u.createdAt?.seconds
            ? new Date(u.createdAt.seconds * 1000).toLocaleDateString()
            : "-"
        }\n`;
      });
    }


    // other report types skipped for brevity
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${reportType.toLowerCase()}_report.csv`;
    a.click();
  };


  /* ================= PDF ================= */
  const downloadPDF = () => {
    const input = pdfRef.current;
    if (!input) return;


    html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const w = pdf.internal.pageSize.getWidth();
      const h = (canvas.height * w) / canvas.width;
      pdf.addImage(img, "PNG", 0, 0, w, h);
      pdf.save(`${reportType.toLowerCase()}_report.pdf`);
    });
  };


  return (
    <AdminLayout>
      <div className="admin-reports-page">
        <h2>Admin Reports</h2>


        {/* REPORT TYPE */}
        <div className="report-type-selector">
          {["Users", "Orders", "Products", "Rentals"].map((type) => (
            <label key={type}>
              <input
                type="radio"
                checked={reportType === type}
                onChange={() => setReportType(type)}
              />
              {type}
            </label>
          ))}
        </div>


        {/* ACTIONS */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          <button className="manage-products-btn" onClick={downloadCSV}>
            Download CSV
          </button>
          <button className="manage-products-btn" onClick={downloadPDF}>
            Download PDF
          </button>
        </div>


        {/* ================= GRAPH + TABLE WRAP ================= */}
        <div ref={pdfRef}>
          {/* GRAPH */}
          <div style={{ width: "100%", height: 320, marginBottom: 20 }}>
            {(reportType === "Users" ||
              reportType === "Products" ||
              reportType === "Rentals") && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" />
                </BarChart>
              </ResponsiveContainer>
            )}


            {reportType === "Orders" && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getOrderTrendData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line dataKey="value" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>


          {/* TABLE */}
          <div className="table-container">
            {loading && <p>Loading...</p>}


            {!loading && data.length > 0 && (
              <table className="user-table">
                <thead>
                  <tr>
                    {reportType === "Users" && (
                      <>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Role</th>
                        <th>Created At</th>
                      </>
                    )}
                    {/* add other report headers here */}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row) => (
                    <tr key={row.id}>
                      {reportType === "Users" && (
                        <>
                          <td>{row.id}</td>
                          <td>{row.firstName + " " + row.lastName}</td>
                          <td>{row.email}</td>
                          <td>{row.mobile || "-"}</td>
                          <td>{row.role}</td>
                          <td>
                            {row.createdAt?.seconds
                              ? new Date(
                                  row.createdAt.seconds * 1000
                                ).toLocaleDateString()
                              : "-"}
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {!loading && data.length === 0 && <p>No data available</p>}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}


export default AdminReports;
