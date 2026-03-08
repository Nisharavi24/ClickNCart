import React from "react";
import AdminLayout from "../components/AdminLayout";
import "../styles/manageOrders.css";
import { useNavigate } from "react-router-dom";

function ManageOrders() {
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <div className="top-buttons">

        {/* ===== Back Button ===== */}
        <button
          className="back-btn"
          onClick={() => navigate("/dashboard/admin")}
        >
          ← Back to Dashboard
        </button>

        <h2 className="page-title">Manage Orders</h2>

        {/* ===== View All Orders Button ===== */}
        <button
          className="view-all-btn"
          onClick={() => navigate("/admin/view-all-orders")}
        >
          View All Orders
        </button>

        {/* ===== Orders Grid ===== */}
        <div className="orders-grid">

          {/* Sales Orders Card */}
          <div
            className="order-card"
            onClick={() => navigate("/admin/orders")}
          >
            <div className="order-icon sales">🛒</div>
            <h3>Sales Orders</h3>
            <p>View all product sale orders</p>
          </div>

          {/* Rental Orders Card */}
          <div
            className="order-card"
            onClick={() => navigate("/admin/rentals")}
          >
            <div className="order-icon rent">📅</div>
            <h3>Rental Orders</h3>
            <p>View all rental product orders</p>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}

export default ManageOrders;