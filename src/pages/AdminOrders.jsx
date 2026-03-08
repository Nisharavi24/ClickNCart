// src/pages/AdminOrders.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { collection, doc, onSnapshot, query, updateDoc } from "firebase/firestore";
import { jsPDF } from "jspdf";
import "../styles/AdminOrders.css";
import logo from "../assets/logo.png";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [editOrderId, setEditOrderId] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [updatedPayment, setUpdatedPayment] = useState("");

  const statuses = ["Pending", "Dispatched", "Out for Delivery", "Delivered"];
  const paymentStatuses = ["Pending", "Paid", "Failed"];

  // ---------------- FETCH SALES ORDERS ----------------
  useEffect(() => {
    const q = query(collection(db, "orders"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userOrders = snapshot.docs
        .map((doc) => {
          const data = doc.data();
          const salesCart = (data.cart || []).filter((item) => item.type === "sale");

          if (!salesCart.length) return null;

          return {
            id: doc.id,
            ...data,
            cart: salesCart,
          };
        })
        .filter(Boolean);

      setOrders(userOrders);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const renderStatusBar = (status) => (
    <div className="order-status-bar">
      {statuses.map((s, i) => (
        <div
          key={i}
          className={`status-step ${
            statuses.indexOf(status) >= i ? "active" : ""
          } ${statuses.indexOf(status) === i ? "current" : ""}`}
        >
          {s}
        </div>
      ))}
    </div>
  );

  const handleUpdateOrder = async (order) => {
    if (!updatedStatus && !updatedPayment) return;

    const updatedData = {
      status: updatedStatus || order.status,
      paymentStatus: updatedPayment || order.paymentStatus,
    };

    try {
      await updateDoc(doc(db, "orders", order.id), updatedData);
      alert("Order updated successfully!");
      setEditOrderId(null);
      setUpdatedStatus("");
      setUpdatedPayment("");
    } catch (err) {
      console.error("Error updating order:", err);
      alert("Failed to update order. Check console.");
    }
  };

  if (loading)
    return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading orders...</p>;
  if (!orders.length)
    return <p style={{ textAlign: "center", marginTop: "50px" }}>No sales orders yet.</p>;

  return (
    <div className="orders-container">
      <button
        className="admin-back-btn"
        style={{
          backgroundColor: "#1e3a8a",
          color: "white",
          padding: "10px 18px",
          fontSize: "16px",
          borderRadius: "8px",
          border: "none",
          marginBottom: "20px",
          cursor: "pointer",
        }}
        onClick={() => window.history.back()}
      >
        ← Back to Manage Orders
      </button>

      <h2>All Sales Orders</h2>

      {orders.map((order) => (
        <div key={order.id} className="order-card">
          <div className="order-header">
            <p><strong>Order ID:</strong> {order.orderId}</p>

            <h4>Delivery Details:</h4>
            <p>{order.deliveryDetails?.name || "N/A"}</p>
            <p>{order.deliveryDetails?.phone || "N/A"}</p>
            <p>
              {order.deliveryDetails?.address || ""}, {order.deliveryDetails?.city || ""},{" "}
              {order.deliveryDetails?.state || ""} - {order.deliveryDetails?.pincode || ""}
            </p>

            <p><strong>Payment Status:</strong> {order.paymentStatus || "Pending"}</p>
            <p><strong>Order Status:</strong> {order.status || "Pending"}</p>
          </div>

          <div className="order-products">
            {order.cart?.map((prod, index) => (
              <div key={`${order.id}-${index}`} className="product-row">
                <div className="product-left">
                  <div className="product-image">
                    <img
                      src={prod.image || "/images/no-image.png"}
                      alt={prod.name}
                      onError={(e) => (e.target.src = "/images/no-image.png")}
                    />
                  </div>

                  <div className="product-details">
                    <p><strong>{prod.name}</strong></p>
                    <p>Quantity: {prod.quantity}</p>
                  </div>
                </div>

                <div className="product-total">
                  <strong>Rs. {(prod.price * prod.quantity).toFixed(2)}</strong>
                </div>
              </div>
            ))}
          </div>

          <div className="order-actions">
            {editOrderId === order.id ? (
              <>
                <select
                  value={updatedStatus}
                  onChange={(e) => setUpdatedStatus(e.target.value)}
                >
                  <option value="">Select Order Status</option>
                  {statuses.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>

                <select
                  value={updatedPayment}
                  onChange={(e) => setUpdatedPayment(e.target.value)}
                >
                  <option value="">Select Payment Status</option>
                  {paymentStatuses.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>

                <button onClick={() => handleUpdateOrder(order)}>Save</button>
                <button onClick={() => setEditOrderId(null)}>Cancel</button>
              </>
            ) : (
              <button onClick={() => setEditOrderId(order.id)}>Edit Status</button>
            )}

            <button
              onClick={() =>
                setTrackingOrder(trackingOrder?.id === order.id ? null : order)
              }
            >
              Track Order
            </button>
          </div>

          {trackingOrder?.id === order.id && renderStatusBar(order.status)}
        </div>
      ))}
    </div>
  );
}

export default AdminOrders;