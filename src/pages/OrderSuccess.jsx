import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import "../styles/orderSuccess.css";




function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();




  // Access fields directly as passed from Checkout
  const { orderId, totalAmount, orderedItems } = location.state || {};




  // Redirect if page is opened directly without state
  useEffect(() => {
    if (!orderId) {
      navigate("/", { replace: true });
    }
  }, [orderId, navigate]);




  // Calculate total including GST
  const totalWithGST = useMemo(() => {
    if (!orderedItems) return 0;
    const subtotal = orderedItems.reduce(
      (acc, prod) =>
        acc +
        (prod.rentPrice
          ? prod.rentPrice * (prod.rentDuration || 1)
          : prod.price * (prod.quantity || 1)),
      0
    );
    const gstAmount = subtotal * 0.18; // 18% GST
    return +(subtotal + gstAmount).toFixed(2);
  }, [orderedItems]);




  if (!orderId) return null;




  return (
    <div className="success-page">
      <div className="success-card">
        <div className="checkmark-circle">
          <span className="checkmark">✓</span>
        </div>




        <h2>Order Placed Successfully!</h2>
        <p className="success-message">Thank you for shopping with us.</p>




        <p className="order-id">
          Your Order ID: <span>{orderId}</span>
        </p>




        {/* Show final total including GST */}
        <p className="order-total">
          Total Bill: <span>₹{totalWithGST}</span>
        </p>




        <h3>Ordered Items:</h3>
        <ul>
          {orderedItems.map((item) => (
            <li key={item.id}>
              {item.name} - ₹
              {item.rentPrice
                ? item.rentPrice * (item.rentDuration || 1)
                : item.price * (item.quantity || 1)}{" "}
              {item.rentDuration ? `(Rent: ${item.rentDuration} month(s))` : ""}
            </li>
          ))}
        </ul>




        <div className="success-buttons">
          <button onClick={() => navigate("/")}>Go to Home</button>
        </div>
      </div>
    </div>
  );
}




export default OrderSuccess;
