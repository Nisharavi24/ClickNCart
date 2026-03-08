// src/pages/ViewOrders.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { collection, doc, onSnapshot, query, updateDoc } from "firebase/firestore";
import "../styles/viewAllOrders.css";

function ViewAllOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState({ orderId: null, productId: null });
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [updatedPayment, setUpdatedPayment] = useState("");

  const statuses = ["Pending", "Dispatched", "Out for Delivery", "Delivered"];
  const paymentStatuses = ["Pending", "Paid", "Failed"];

  useEffect(() => {
    const q = query(collection(db, "orders"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userOrders = snapshot.docs
        .map((doc) => {
          const data = doc.data();
          const saleCart = (data.cart || []).filter(item => item.type === "sale");
          const rentCart = (data.cart || []).filter(item => item.type === "rent");

          if (!saleCart.length && !rentCart.length) return null;

          return {
            id: doc.id,
            ...data,
            saleCart,
            rentCart
          };
        })
        .filter(Boolean);

      setOrders(userOrders);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleUpdateProduct = async (order, product) => {
    if (!updatedStatus && !updatedPayment) return;

    const isRent = product.type === "rent";
    let updatedSaleCart = order.saleCart;
    let updatedRentCart = order.rentCart;

    if (isRent) {
      updatedRentCart = order.rentCart.map(p =>
        p.id === product.id
          ? { ...p, status: updatedStatus || p.status, paymentStatus: updatedPayment || p.paymentStatus }
          : p
      );
    } else {
      updatedSaleCart = order.saleCart.map(p =>
        p.id === product.id
          ? { ...p, status: updatedStatus || p.status, paymentStatus: updatedPayment || p.paymentStatus }
          : p
      );
    }

    const finalCart = [...updatedSaleCart, ...updatedRentCart];

    try {
      await updateDoc(doc(db, "orders", order.id), { cart: finalCart });
      setEditProduct({ orderId: null, productId: null });
      setUpdatedStatus("");
      setUpdatedPayment("");
      alert("Product updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update product.");
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading orders...</p>;
  if (!orders.length) return <p style={{ textAlign: "center", marginTop: "50px" }}>No orders yet.</p>;

  return (
    <div className="orders-container">
      <h2>All Orders (Sale & Rent)</h2>

      {orders.map(order => (
        <div key={order.id} className="order-card">
          <div className="order-header">
            <p><strong>Order ID:</strong> {order.orderId}</p>
            <h4>Delivery Details:</h4>
            <p>{order.deliveryDetails?.name || "N/A"}</p>
            <p>{order.deliveryDetails?.phone || "N/A"}</p>
            <p>{order.deliveryDetails?.address || ""}, {order.deliveryDetails?.city || ""}, {order.deliveryDetails?.state || ""} - {order.deliveryDetails?.pincode || ""}</p>
          </div>

          {/* Sale Items */}
          {order.saleCart?.length > 0 && (
            <>
              <h3>Sale Items</h3>
              {order.saleCart.map(prod => (
                <div key={prod.id} className="product-row">
                  <div className="product-left">
                    <img src={prod.image || "/images/no-image.png"} alt={prod.name} />
                    <div>
                      <p><strong>{prod.name}</strong></p>
                      <p>Quantity: {prod.quantity}</p>
                      <p>Payment: {prod.paymentStatus || "Pending"}</p>
                      <p>Status: {prod.status || "Pending"}</p>
                    </div>
                  </div>
                  <div>Rs. {(prod.price * prod.quantity).toFixed(2)}</div>
                  <div>
                    {editProduct.orderId === order.id && editProduct.productId === prod.id ? (
                      <>
                        <select value={updatedStatus} onChange={e => setUpdatedStatus(e.target.value)}>
                          <option value="">Order Status</option>
                          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <select value={updatedPayment} onChange={e => setUpdatedPayment(e.target.value)}>
                          <option value="">Payment Status</option>
                          {paymentStatuses.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        <button onClick={() => handleUpdateProduct(order, prod)}>Save</button>
                        <button onClick={() => setEditProduct({ orderId: null, productId: null })}>Cancel</button>
                      </>
                    ) : (
                      <button onClick={() => setEditProduct({ orderId: order.id, productId: prod.id })}>Edit</button>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Rent Items */}
          {order.rentCart?.length > 0 && (
            <>
              <h3>Rent Items</h3>
              {order.rentCart.map(prod => (
                <div key={prod.id} className="product-row">
                  <div className="product-left">
                    <img src={prod.image || "/images/no-image.png"} alt={prod.name} />
                    <div>
                      <p><strong>{prod.name}</strong></p>
                      <p>Months: {prod.rentMonths || 1}</p>
                      <p>Payment: {prod.paymentStatus || "Pending"}</p>
                      <p>Status: {prod.status || "Pending"}</p>
                    </div>
                  </div>
                  <div>Rs. {(prod.price * (prod.rentMonths || 1)).toFixed(2)}</div>
                  <div>
                    {editProduct.orderId === order.id && editProduct.productId === prod.id ? (
                      <>
                        <select value={updatedStatus} onChange={e => setUpdatedStatus(e.target.value)}>
                          <option value="">Order Status</option>
                          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <select value={updatedPayment} onChange={e => setUpdatedPayment(e.target.value)}>
                          <option value="">Payment Status</option>
                          {paymentStatuses.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        <button onClick={() => handleUpdateProduct(order, prod)}>Save</button>
                        <button onClick={() => setEditProduct({ orderId: null, productId: null })}>Cancel</button>
                      </>
                    ) : (
                      <button onClick={() => setEditProduct({ orderId: order.id, productId: prod.id })}>Edit</button>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default ViewAllOrders;