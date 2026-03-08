import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext"; // your existing Cart context
import "../styles/rentCart.css";




function RentCart() {
  const { cartItems, updateItemDuration, removeFromCart } = useCart();




  const rentItems = cartItems.filter((item) => item.rentPrice); // only rent items




  const [durations, setDurations] = useState({}); // track selected duration per item




  useEffect(() => {
    // initialize durations to 1 month by default
    const initialDurations = {};
    rentItems.forEach((item) => {
      initialDurations[item.id] = item.rentDuration || 1;
    });
    setDurations(initialDurations);
  }, [rentItems]);




  const handleDurationChange = (itemId, value) => {
    const val = Math.min(Math.max(value, 1), 3); // max 3 months, min 1 month
    setDurations((prev) => ({ ...prev, [itemId]: val }));
    updateItemDuration(itemId, val); // update context/cart if needed
  };




  const calculateItemTotal = (item) =>
    item.rentPrice * (durations[item.id] || 1) * (item.quantity || 1);




  const calculateTotalAmount = () =>
    rentItems.reduce((total, item) => total + calculateItemTotal(item), 0);




  if (rentItems.length === 0) {
    return <p className="empty-message">No rent products in your cart.</p>;
  }




  return (
    <div className="rent-cart-container">
      <h2>Rent Products</h2>
      <div className="rent-cart-items">
        {rentItems.map((item) => (
          <div className="rent-cart-item" key={item.id}>
            <img src={item.imgUrl} alt={item.name} className="rent-cart-img" />
            <div className="rent-cart-details">
              <h3>{item.name}</h3>
              <p>₹{item.rentPrice} / month</p>




              <div className="rent-duration">
                <label>Duration:</label>
                <input
                  type="number"
                  min="1"
                  max="3"
                  value={durations[item.id]}
                  onChange={(e) =>
                    handleDurationChange(item.id, parseInt(e.target.value))
                  }
                />
                <span>months (max 3)</span>
              </div>




              <p className="item-total">
                Total: ₹{calculateItemTotal(item)}
              </p>




              <button
                className="remove-btn"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>




      <div className="rent-cart-summary">
        <h3>Total Amount: ₹{calculateTotalAmount()}</h3>
        <button className="checkout-btn">Proceed to Checkout</button>
      </div>
    </div>
  );
}




export default RentCart;

