import React from "react";
import { useCart } from "../context/CartContext";
import jsPDF from "jspdf";
import "../styles/Invoice.css";








function Invoice() {
  const { cartItems, getTotal } = useCart();








  const subtotal = getTotal();
  const gst = subtotal * 0.18;
  const finalTotal = subtotal + gst;








  const generatePDF = () => {
    const doc = new jsPDF();








    doc.setFontSize(18);
    doc.text("INVOICE", 20, 20);








    doc.setFontSize(12);
    let y = 40;








    cartItems.forEach((item, index) => {
      doc.text(
        `${index + 1}. ${item.name} x${item.quantity} - ₹${item.price * item.quantity}`,
        20,
        y
      );
      y += 10;
    });








    y += 10;
    doc.text(`Subtotal: ₹${subtotal.toFixed(2)}`, 20, y);
    y += 10;
    doc.text(`GST (18%): ₹${gst.toFixed(2)}`, 20, y);
    y += 10;
    doc.text(`Total: ₹${finalTotal.toFixed(2)}`, 20, y);








    doc.save("Invoice.pdf");
  };








  return (
    <div className="invoice-container">
      <div className="invoice-box">
        <h2>🧾 Order Invoice</h2>








        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Total</th>
            </tr>
          </thead>








          <tbody>
            {cartItems.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>₹{item.price * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>








        <div className="bill-summary">
          <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
          <p>GST (18%): ₹{gst.toFixed(2)}</p>
          <h3>Total: ₹{finalTotal.toFixed(2)}</h3>
        </div>








        <button onClick={generatePDF} className="download-btn">
          Download Bill
        </button>
      </div>
    </div>
  );
}








export default Invoice;
