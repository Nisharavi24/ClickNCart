// src/pages/AdminSales.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { collection, doc, onSnapshot, query, updateDoc } from "firebase/firestore";
import AdminLayout from "../components/AdminLayout";
import "../styles/AdminOrders.css";
import "../styles/AdminSales.css";

function AdminSales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editSaleId, setEditSaleId] = useState(null);
  const [editProductId, setEditProductId] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [updatedPayment, setUpdatedPayment] = useState("");

  const statuses = ["Pending", "Shipped", "Delivered", "Cancelled"];
  const paymentStatuses = ["Pending", "Paid", "Failed"];

  useEffect(() => {
    const q = query(collection(db, "orders"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allSales = snapshot.docs
        .map((doc) => {
          const data = doc.data();
          const saleItems = (data.cart || []).filter((item) => item.type === "sale");
          if (!saleItems.length) return null;

          return {
            id: doc.id,
            orderId: data.orderId,
            deliveryDetails: data.deliveryDetails,
            cart: saleItems,
          };
        })
        .filter(Boolean);

      setSales(allSales);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleUpdateSaleProduct = async (order, product) => {
    if (!updatedStatus && !updatedPayment) return;

    const updatedCart = order.cart.map(p =>
      p.id === product.id
        ? { ...p, status: updatedStatus || p.status, paymentStatus: updatedPayment || p.paymentStatus }
        : p
    );

    try {
      await updateDoc(doc(db, "orders", order.id), { cart: updatedCart });
      setEditSaleId(null);
      setEditProductId(null);
      setUpdatedStatus("");
      setUpdatedPayment("");
      alert("Sale product updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update product.");
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading sales...</p>;
  if (!sales.length) return <p style={{ textAlign: "center", marginTop: "50px" }}>No sales yet.</p>;

  return (
    <AdminLayout>
      <div className="orders-container">
        <h2>All Sales</h2>

        {sales.map((order) => (
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
                    <p>Quantity: {product.quantity || 1}</p>
                    <p>Payment: {product.paymentStatus || "Pending"}</p>
                    <p>Status: {product.status || "Pending"}</p>
                  </div>
                </div>
                <div>Rs. {(product.price * (product.quantity || 1)).toFixed(2)}</div>
                <div>
                  {editSaleId === order.id && editProductId === product.id ? (
                    <>
                      <select value={updatedStatus} onChange={e => setUpdatedStatus(e.target.value)}>
                        <option value="">Order Status</option>
                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <select value={updatedPayment} onChange={e => setUpdatedPayment(e.target.value)}>
                        <option value="">Payment Status</option>
                        {paymentStatuses.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                      <button onClick={() => handleUpdateSaleProduct(order, product)}>Save</button>
                      <button onClick={() => { setEditSaleId(null); setEditProductId(null); }}>Cancel</button>
                    </>
                  ) : (
                    <button onClick={() => { setEditSaleId(order.id); setEditProductId(product.id); }}>Edit</button>
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

export default AdminSales;