// src/pages/AdminRentals.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { collection, doc, onSnapshot, query, updateDoc } from "firebase/firestore";
import AdminLayout from "../components/AdminLayout";
import "../styles/AdminOrders.css";

function AdminRentals() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editRentalId, setEditRentalId] = useState(null);
  const [editProductId, setEditProductId] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [updatedPayment, setUpdatedPayment] = useState("");

  const statuses = ["Pending", "Active", "Completed", "Cancelled"];
  const paymentStatuses = ["Pending", "Paid", "Failed"];

  useEffect(() => {
    const q = query(collection(db, "orders"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allRentals = snapshot.docs
        .map(doc => {
          const data = doc.data();
          const rentalItems = (data.cart || []).filter(item => item.type === "rent");
          if (!rentalItems.length) return null;

          return {
            id: doc.id,
            orderId: data.orderId,
            deliveryDetails: data.deliveryDetails,
            cart: rentalItems
          };
        })
        .filter(Boolean);

      setRentals(allRentals);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleUpdateRentalProduct = async (order, product) => {
    if (!updatedStatus && !updatedPayment) return;

    const updatedCart = order.cart.map(p =>
      p.id === product.id
        ? { ...p, status: updatedStatus || p.status, paymentStatus: updatedPayment || p.paymentStatus }
        : p
    );

    try {
      await updateDoc(doc(db, "orders", order.id), { cart: updatedCart });
      setEditRentalId(null);
      setEditProductId(null);
      setUpdatedStatus("");
      setUpdatedPayment("");
      alert("Rental product updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update product.");
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading rentals...</p>;
  if (!rentals.length) return <p style={{ textAlign: "center", marginTop: "50px" }}>No rentals yet.</p>;

  return (
    <AdminLayout>
      <div className="orders-container">
        <h2>All Rentals</h2>

        {rentals.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <p><strong>Order ID:</strong> {order.orderId || order.id}</p>
              <h4>Customer Details:</h4>
              <p>{order.deliveryDetails?.name || "N/A"}</p>
              <p>{order.deliveryDetails?.phone || "N/A"}</p>
              <p>{order.deliveryDetails?.address || ""}, {order.deliveryDetails?.city || ""}, {order.deliveryDetails?.state || ""} - {order.deliveryDetails?.pincode || ""}</p>
            </div>

            {order.cart.map(product => (
              <div key={product.id} className="product-row">
                <div className="product-left">
                  <img src={product.image || "/images/no-image.png"} alt={product.name} />
                  <div>
                    <p><strong>{product.name}</strong></p>
                    <p>Months: {product.rentMonths || 1}</p>
                    <p>Payment: {product.paymentStatus || "Pending"}</p>
                    <p>Status: {product.status || "Pending"}</p>
                  </div>
                </div>
                <div>Rs. {(product.price * (product.rentMonths || 1)).toFixed(2)}</div>
                <div>
                  {editRentalId === order.id && editProductId === product.id ? (
                    <>
                      <select value={updatedStatus} onChange={e => setUpdatedStatus(e.target.value)}>
                        <option value="">Rental Status</option>
                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <select value={updatedPayment} onChange={e => setUpdatedPayment(e.target.value)}>
                        <option value="">Payment Status</option>
                        {paymentStatuses.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                      <button onClick={() => handleUpdateRentalProduct(order, product)}>Save</button>
                      <button onClick={() => { setEditRentalId(null); setEditProductId(null); }}>Cancel</button>
                    </>
                  ) : (
                    <button onClick={() => { setEditRentalId(order.id); setEditProductId(product.id); }}>Edit</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}

export default AdminRentals;