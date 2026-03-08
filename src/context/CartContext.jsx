import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  query,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";


const CartContext = createContext();
export const useCart = () => useContext(CartContext);


export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [userDocId, setUserDocId] = useState(null);
  const auth = getAuth();


  // 🔎 Find user document
  const findUserDoc = async (uid) => {
    const q = query(collection(db, "users"), where("authUid", "==", uid));
    const snap = await getDocs(q);


    if (!snap.empty) {
      const docId = snap.docs[0].id;
      setUserDocId(docId);
      return docId;
    }
    return null;
  };


  // 🛒 ADD TO CART
  const addToCart = async (product) => {
    if (!auth.currentUser) {
      alert("Please login first");
      return;
    }


    let docId = userDocId;
    if (!docId) {
      docId = await findUserDoc(auth.currentUser.uid);
    }


    if (!docId) return;


    const productRef = doc(db, "users", docId, "cart", product.id);
    const existingItem = cartItems.find((i) => i.id === product.id);


    if (existingItem) {


      // 🚫 Only block when quantity reached stock
      if (existingItem.quantity >= product.stock) {
  alert("Maximum stock reached");
  return;
}


      // Only increase quantity for sale items
      if (existingItem.type !== "rent") {
        await updateDoc(productRef, {
          quantity: existingItem.quantity + 1,
        });
      }


    } else {


      await setDoc(productRef, {
        name: product.name,
        price: Number(product.price),
        image: product.image || "",
        type: product.type || "sale",
        stock: product.stock || 1,   // ✅ store stock
        quantity: product.type === "rent" ? null : 1,
        rentMonths: product.type === "rent" ? 1 : null,
      });


    }
  };


  // ❌ REMOVE FROM CART
  const removeFromCart = async (id) => {
    if (!userDocId) return;
    await deleteDoc(doc(db, "users", userDocId, "cart", id));
  };


  // ➕ INCREASE QUANTITY
  const increaseQty = async (id) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item || !userDocId || item.type === "rent") return;


    // 🚫 stop when reaching stock
    if (item.quantity >= item.stock) {
      alert("Maximum stock reached");
      return;
    }


    await updateDoc(doc(db, "users", userDocId, "cart", id), {
      quantity: item.quantity + 1,
    });
  };


  // ➖ DECREASE QUANTITY
  const decreaseQty = async (id) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item || !userDocId || item.type === "rent") return;


    if (item.quantity <= 1) {
      await deleteDoc(doc(db, "users", userDocId, "cart", id));
    } else {
      await updateDoc(doc(db, "users", userDocId, "cart", id), {
        quantity: item.quantity - 1,
      });
    }
  };


  // 📅 UPDATE RENT MONTHS
  const updateRentMonths = async (id, months) => {
    if (!userDocId) return;


    await updateDoc(doc(db, "users", userDocId, "cart", id), {
      rentMonths: Number(months),
    });
  };


  // 💰 TOTAL
  const getTotal = () => {
    return cartItems.reduce((total, item) => {
      if (item.type === "rent") {
        const months = item.rentMonths || 1;
        return total + item.price * months;
      }
      return total + item.price * item.quantity;
    }, 0);
  };


  // 🔄 REALTIME LISTENER
  useEffect(() => {
    let unsubscribeCart;


    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setCartItems([]);
        setUserDocId(null);
        return;
      }


      const docId = await findUserDoc(user.uid);
      if (!docId) return;


      const cartRef = collection(db, "users", docId, "cart");


      unsubscribeCart = onSnapshot(cartRef, (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCartItems(items);
      });
    });


    return () => {
      unsubscribeAuth();
      if (unsubscribeCart) unsubscribeCart();
    };
  }, []);


  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        updateRentMonths,
        getTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
