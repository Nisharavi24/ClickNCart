import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth, db } from "../firebase/firebase";
import "../styles/checkout.css";

import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  increment,
  serverTimestamp,
  onSnapshot,
  runTransaction,
} from "firebase/firestore";

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedItems = location.state?.selectedItems || [];

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "Cash on Delivery",
  });

  const [errors, setErrors] = useState({});
  const [userDocId, setUserDocId] = useState(null);
  const [savedAddress, setSavedAddress] = useState(null);
  const [isEditing, setIsEditing] = useState(true);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);

  /* ================= LOAD USER ================= */
  useEffect(() => {
    let unsubscribeCart = null;

    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const q = query(collection(db, "users"), where("authUid", "==", user.uid));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const docId = snapshot.docs[0].id;
          setUserDocId(docId);

          const userData = snapshot.docs[0].data();

          if (userData.address) {
            const loadedAddress = {
              name: userData.address.name || "",
              phone: userData.address.phone || "",
              email: userData.address.email || "",
              address: userData.address.addressLine || "",
              city: userData.address.city || "",
              state: userData.address.state || "",
              pincode: userData.address.pincode || "",
              paymentMethod: "Cash on Delivery",
            };

            setFormData(loadedAddress);
            setSavedAddress(loadedAddress);
            setIsEditing(false);
          }

          const cartRef = collection(db, "users", docId, "cart");

          unsubscribeCart = onSnapshot(cartRef, async (snapshot) => {
            const loadedCart = await Promise.all(
              snapshot.docs.map(async (docItem) => {
                const itemData = docItem.data();
                const productSnap = await getDoc(doc(db, "products", itemData.productId || docItem.id));
                const latestStock = productSnap.exists() ? productSnap.data().stock : 0;

                // Ensure quantity never exceeds stock
                return {
                  id: docItem.id,
                  ...itemData,
                  quantity: Math.min(itemData.quantity || 1, latestStock),
                  maxStock: latestStock,
                };
              })
            );

            setCartItems(loadedCart);
          });
        }
      } catch (error) {
        console.error("Error loading user:", error);
      }

      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeCart) unsubscribeCart();
    };
  }, []);

  /* ================= VALIDATION ================= */
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Full Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^[6-9]\d{9}$/.test(formData.phone)) newErrors.phone = "Enter valid 10-digit Indian mobile number";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Enter valid email address";

    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";

    if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = "Enter valid 6-digit pincode";

    return newErrors;
  };

  /* ================= PLACE ORDER ================= */
  const placeOrder = async () => {
    if (!userDocId) {
      alert("User not loaded. Please refresh.");
      return;
    }

    try {
      const cartItemsToOrder = cartItems.filter((item) =>
        selectedItems.length > 0 ? selectedItems.includes(item.id) : true
      );

      if (cartItemsToOrder.length === 0) {
        alert("No items selected for checkout.");
        return;
      }

      const totalAmount = cartItemsToOrder.reduce(
        (total, item) => total + item.price * (item.quantity || 1),
        0
      );

      /* ===== ORDER ID ===== */
      const counterRef = doc(db, "counters", "orderCounter");
      const counterSnap = await getDoc(counterRef);

      let newOrderNumber = 1;

      if (counterSnap.exists()) {
        newOrderNumber = counterSnap.data().lastId + 1;
        await updateDoc(counterRef, { lastId: increment(1) });
      } else {
        await setDoc(counterRef, { lastId: 1 });
      }

      const customOrderId = `O26${String(newOrderNumber).padStart(4, "0")}`;

      /* ===== SAVE ORDER ===== */
      await setDoc(doc(db, "orders", customOrderId), {
        orderId: customOrderId,
        userId: userDocId,
        cart: cartItemsToOrder,
        deliveryDetails: formData,
        paymentMethod: formData.paymentMethod,
        totalAmount,
        status: "Pending",
        createdAt: serverTimestamp(),
      });

      /* ===== TRANSACTION STOCK UPDATE (Sales + Rentals) ===== */
      for (let item of cartItemsToOrder) {
        const productId = item.productId || item.id;
        const productRef = doc(db, "products", productId);

        await runTransaction(db, async (transaction) => {
          const productSnap = await transaction.get(productRef);
          if (!productSnap.exists()) throw `Product not found: ${item.name}`;

          const currentStock = productSnap.data().stock || 0;
          const isRental = item.type === "rental"; // rentals always decrement 1
          const decrementBy = isRental ? 1 : item.quantity || 1;

          if (currentStock < decrementBy) throw `Not enough stock for ${item.name}`;

          transaction.update(productRef, { stock: currentStock - decrementBy });
        });
      }

      /* ===== DELETE CART ITEMS ===== */
      for (let item of cartItemsToOrder) {
        await deleteDoc(doc(db, "users", userDocId, "cart", item.id));
      }

      /* ===== SAVE ADDRESS ===== */
      await updateDoc(doc(db, "users", userDocId), {
        address: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          addressLine: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
      });

      navigate("/order-success", {
        replace: true,
        state: {
          orderId: customOrderId,
          totalAmount,
          orderedItems: cartItemsToOrder,
        },
      });
    } catch (error) {
      console.error("Order Error:", error);
      alert(error.message || "Something went wrong.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length !== 0) return;
    await placeOrder();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="checkout-container">
      <div className="checkout-box">
        <h2>Delivery Details</h2>

        {savedAddress && !isEditing && (
          <div className="saved-address">
            <h3>Saved Address</h3>
            <p><strong>{savedAddress.name}</strong></p>
            <p>{savedAddress.phone}</p>
            <p>{savedAddress.email}</p>
            <p>{savedAddress.address}</p>
            <p>{savedAddress.city}, {savedAddress.state} - {savedAddress.pincode}</p>
            <p><strong>Payment Method:</strong> {savedAddress.paymentMethod}</p>

            <div className="btn-row">
              <button className="primary-btn" onClick={placeOrder}>
                Use This Address & Place Order
              </button>
              <button className="secondary-btn" onClick={() => setIsEditing(true)}>
                Edit Address
              </button>
            </div>
          </div>
        )}

        {isEditing && (
          <form onSubmit={handleSubmit} noValidate>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Full Name" />
            {errors.name && <span className="error">{errors.name}</span>}

            <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="Phone" />
            {errors.phone && <span className="error">{errors.phone}</span>}

            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Email" />
            {errors.email && <span className="error">{errors.email}</span>}

            <textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Address" />
            {errors.address && <span className="error">{errors.address}</span>}

            <input type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} placeholder="City" />
            {errors.city && <span className="error">{errors.city}</span>}

            <input type="text" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} placeholder="State" />
            {errors.state && <span className="error">{errors.state}</span>}

            <input type="text" value={formData.pincode} onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} placeholder="Pincode" />
            {errors.pincode && <span className="error">{errors.pincode}</span>}

            <div className="payment-section">
              <h3>Payment Method</h3>
              <label>
                <input type="radio" name="paymentMethod" value="Cash on Delivery" checked readOnly />
                Cash on Delivery
              </label>
            </div>

            <button className="primary-btn" type="submit">
              {savedAddress ? "Update & Place Order" : "Place Order"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Checkout;