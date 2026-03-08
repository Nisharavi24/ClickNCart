// src/pages/MyOrders.jsx
import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { jsPDF } from "jspdf";
import logo from "../assets/logo.png";
import "../styles/MyOrders.css";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackingOrder, setTrackingOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, "orders"),
        where("deliveryDetails.email", "==", user.email)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const userOrders = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOrders(userOrders);
        setLoading(false);
      });

      return unsubscribe;
    };

    const unsubscribeAuth = auth.onAuthStateChanged(() => {
      fetchOrders();
    });

    return () => unsubscribeAuth();
  }, []);

  const statuses = ["Pending", "Dispatched", "Out for Delivery", "Delivered"];

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

  const downloadInvoice = (order) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const img = new Image();
    img.src = logo;

    img.onload = () => {
      doc.addImage(img, "PNG", 20, 15, 25, 25);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("JERAPHIC TECHNOLOGIES", pageWidth / 2, 22, { align: "center" });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(
        "PNS Layout, HRBR Layout, Bengaluru, Karnataka-560043",
        pageWidth / 2,
        28,
        { align: "center" }
      );
      doc.text(
        "Phone: 9901450558 | Email: technologiesjeraphic@gmail.com",
        pageWidth / 2,
        33,
        { align: "center" }
      );

      doc.line(20, 42, pageWidth - 20, 42);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text("INVOICE", pageWidth / 2, 55, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(`Order ID: ${order.orderId}`, 20, 70);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - 20, 70, {
        align: "right",
      });

      doc.setFont("helvetica", "bold");
      doc.text("Bill To:", 20, 85);

      doc.setFont("helvetica", "normal");
      doc.text(order.deliveryDetails?.name || "", 20, 92);
      doc.text(order.deliveryDetails?.phone || "", 20, 99);

      const addressLine = `${order.deliveryDetails?.address}, ${order.deliveryDetails?.city}, ${order.deliveryDetails?.state} - ${order.deliveryDetails?.pincode}`;
      doc.text(doc.splitTextToSize(addressLine, 170), 20, 106);

      /* ===== TABLE ===== */
      let y = 125;
      const colNo = 20;
      const colProduct = 40;
      const colQty = 130;
      const colPrice = 155;
      const colTotal = 185;

      doc.setFont("helvetica", "bold");
      doc.text("No", colNo, y);
      doc.text("Product", colProduct, y);
      doc.text("Qty", colQty, y, { align: "right" });
      doc.text("Price", colPrice, y, { align: "right" });
      doc.text("Total", colTotal, y, { align: "right" });
      doc.line(20, y + 3, pageWidth - 20, y + 3);
      y += 12;

      doc.setFont("helvetica", "normal");

      let subtotal = 0;

      order.cart?.forEach((prod, index) => {
        let total = prod.type === "rent" ? prod.price * (prod.rentMonths || 1) : prod.price * prod.quantity;
        subtotal += total;

        doc.text(String(index + 1), colNo, y);
        doc.text(prod.name, colProduct, y);
        doc.text(
          prod.type === "rent" ? String(prod.rentMonths || 1) : String(prod.quantity),
          colQty,
          y,
          { align: "right" }
        );
        doc.text(`Rs. ${prod.price.toFixed(2)}`, colPrice, y, { align: "right" });
        doc.text(`Rs. ${total.toFixed(2)}`, colTotal, y, { align: "right" });

        y += 10;
      });

      doc.line(20, y, pageWidth - 20, y);
      y += 15;

      const gst = subtotal * 0.18;
      const grandTotal = subtotal + gst;

      doc.setFont("helvetica", "bold");
      doc.text("Subtotal:", colPrice, y, { align: "right" });
      doc.text(`Rs. ${subtotal.toFixed(2)}`, colTotal, y, { align: "right" });
      y += 8;

      doc.text("GST (18%):", colPrice, y, { align: "right" });
      doc.text(`Rs. ${gst.toFixed(2)}`, colTotal, y, { align: "right" });
      y += 8;

      doc.setFontSize(12);
      doc.text("Grand Total:", colPrice, y, { align: "right" });
      doc.text(`Rs. ${grandTotal.toFixed(2)}`, colTotal, y, { align: "right" });

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Thank you for shopping with us!", pageWidth / 2, y + 20, { align: "center" });

      doc.save(`Invoice_${order.orderId}.pdf`);
    };
  };

  if (loading)
    return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading orders...</p>;

  if (!orders.length)
    return <p style={{ textAlign: "center", marginTop: "50px" }}>You have not placed any orders yet.</p>;

  return (
    <div className="orders-container">
      <h2>My Orders</h2>

      {orders.map((order) => {
        let subtotal = 0;
        order.cart?.forEach((prod) => {
          subtotal += prod.type === "rent" ? prod.price * (prod.rentMonths || 1) : prod.price * prod.quantity;
        });
        const gst = subtotal * 0.18;
        const grandTotal = subtotal + gst;

        return (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <p><strong>Order ID:</strong> {order.orderId}</p>
              <h4>Delivery Details:</h4>
              <p>{order.deliveryDetails?.name}</p>
              <p>{order.deliveryDetails?.phone}</p>
              <p>{order.deliveryDetails?.address}, {order.deliveryDetails?.city}, {order.deliveryDetails?.state} - {order.deliveryDetails?.pincode}</p>
              <p><strong>Payment Method:</strong> {order.paymentMethod || "Cash on Delivery"}</p>
            </div>

            <div className="order-products">
              {order.cart?.map((prod) => {
                const total = prod.type === "rent" ? prod.price * (prod.rentMonths || 1) : prod.price * prod.quantity;
                return (
                  <div key={prod.id} className="product-row">
                    <div className="product-left">
                      <div className="product-image">
                        <img src={prod.image || "/images/no-image.png"} alt={prod.name} />
                      </div>
                      <div className="product-details">
                        <p><strong>{prod.name}</strong></p>
                        {prod.type === "rent" ? <p>Months: {prod.rentMonths || 1}</p> : <p>Quantity: {prod.quantity}</p>}
                        <button
                          className={`payment-btn ${(prod.paymentStatus || "Pending").toLowerCase()}`}
                        >
                          {prod.paymentStatus || "Pending"}
                        </button>
                      </div>
                    </div>
                    <div className="product-total">
                      <strong>Rs. {total.toFixed(2)}</strong>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="order-totals">
              <div className="subtotal-row"><span>Subtotal:</span><span>Rs. {subtotal.toFixed(2)}</span></div>
              <div className="gst-row"><span>GST (18%):</span><span>Rs. {gst.toFixed(2)}</span></div>
              <div className="grand-total-row"><strong>Total Amount:</strong><strong>Rs. {grandTotal.toFixed(2)}</strong></div>
            </div>

            <div className="order-actions">
              <button className="action-btn track-btn" onClick={() => setTrackingOrder(trackingOrder?.id === order.id ? null : order)}>Track Order</button>
              <button className="action-btn invoice-btn" onClick={() => downloadInvoice(order)}>Download Invoice</button>
            </div>

            {trackingOrder?.id === order.id && renderStatusBar(order.status)}
          </div>
        );
      })}
    </div>
  );
}

export default MyOrders;