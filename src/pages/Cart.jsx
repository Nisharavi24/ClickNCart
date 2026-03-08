import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "../styles/cart.css";


function Cart() {
  const navigate = useNavigate();


  const {
    cartItems,
    removeFromCart,
    increaseQty,
    decreaseQty,
    updateRentMonths,
  } = useCart();


  const [selectedItems, setSelectedItems] = useState([]);


  const handleSelect = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };


  const saleItems = cartItems.filter((item) => item.type !== "rent");
  const rentItems = cartItems.filter((item) => item.type === "rent");


  const subtotal = cartItems
    .filter((item) => selectedItems.includes(item.id))
    .reduce((total, item) => {
      if (item.type === "rent") {
        const months = item.rentMonths || 1;
        return total + item.price * months; // ignore quantity for rent
      }
      return total + item.price * item.quantity;
    }, 0);


  const discount = 0;
  const gst = subtotal * 0.18;
  const totalAmount = subtotal + gst - discount;


  return (
    <div className="cart-page">
      <div className="cart-wrapper">
        {/* LEFT SIDE */}
        <div className="cart-left">
          <h2>My Cart ({cartItems.length})</h2>


          {cartItems.length === 0 && <p>Your cart is empty.</p>}


          {/* SALE ITEMS */}
          {saleItems.length > 0 && <h3> Sale Items</h3>}
          {saleItems.map((item) => (
            <div key={item.id} className="cart-item">
              <input
                type="checkbox"
                checked={selectedItems.includes(item.id)}
                onChange={() => handleSelect(item.id)}
                style={{ marginRight: "15px" }}
              />


              <img
                src={item.image}
                alt={item.name}
                onError={(e) => {
                  e.target.src = "/images/no-image.png";
                }}
              />


              <div className="item-details">
                <h3>{item.name}</h3>
                <p className="price">₹ {item.price}</p>


                <div className="qty-controls">
                  <button onClick={() => decreaseQty(item.id)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQty(item.id)}>+</button>
                </div>


                <button
                  className="remove"
                  onClick={() => removeFromCart(item.id)}
                >
                  REMOVE
                </button>
              </div>
            </div>
          ))}


          {/* RENT ITEMS */}
          {rentItems.length > 0 && <h3> Rent Items</h3>}
          {rentItems.map((item) => (
            <div key={item.id} className="cart-item">
              <input
                type="checkbox"
                checked={selectedItems.includes(item.id)}
                onChange={() => handleSelect(item.id)}
                style={{ marginRight: "15px" }}
              />


              <img
                src={item.image}
                alt={item.name}
                onError={(e) => {
                  e.target.src = "/images/no-image.png";
                }}
              />


              <div className="item-details">
                <h3>{item.name}</h3>
                <p className="price">₹ {item.price} / month</p>


                {/* RENT MONTH DROPDOWN */}
                <select
                  value={item.rentMonths || 1}
                  onChange={(e) => updateRentMonths(item.id, e.target.value)}
                  style={{ marginBottom: "10px" }}
                >
                  <option value="1">1 Month</option>
                  <option value="2">2 Months</option>
                  <option value="3">3 Months</option>
                </select>


                <p>Total Rent: ₹ {item.price * (item.rentMonths || 1)}</p>


                {/* REMOVE QUANTITY CONTROLS FOR RENT */}
                <button
                  className="remove"
                  onClick={() => removeFromCart(item.id)}
                >
                  REMOVE
                </button>
              </div>
            </div>
          ))}


          {/* CHECKOUT */}
          {cartItems.length > 0 && (
            <div className="place-order-box">
              <button
                className="place-order-btn"
                onClick={() =>
                  navigate("/checkout", {
                    state: { selectedItems },
                  })
                }
                disabled={selectedItems.length === 0}
              >
                CHECKOUT
              </button>
            </div>
          )}
        </div>


        {/* RIGHT SIDE - PRICE DETAILS */}
        <div className="cart-right">
          <h3>PRICE DETAILS</h3>


          <div className="price-row">
            <span>Price ({selectedItems.length} items)</span>
            <span>₹ {subtotal.toFixed(2)}</span>
          </div>


          <div className="price-row">
            <span>Discount</span>
            <span>- ₹ {discount}</span>
          </div>


          <div className="price-row">
            <span>GST (18%)</span>
            <span>₹ {gst.toFixed(2)}</span>
          </div>


          <hr />


          <div className="total-row">
            <span>Total Amount</span>
            <span>₹ {totalAmount.toFixed(2)}</span>
          </div>


          <p className="secure-text">
            🔒 Safe and Secure Payments. Easy returns.
          </p>
        </div>
      </div>
    </div>
  );
}


export default Cart;
