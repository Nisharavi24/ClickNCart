import { useState } from "react";
import AdminNavbar from "./AdminNavbar";
import "../styles/adminLayout.css";


function AdminLayout({ children }) {
  return (
    <div className="admin-wrapper">
      <div className="admin-main">
        <AdminNavbar />
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}

export default AdminLayout;
