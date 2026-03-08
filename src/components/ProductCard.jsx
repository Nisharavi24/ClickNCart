import React from "react";
import { useCart } from "../context/CartContext";


function ProductCard({ product }) {
  const { addToCart, cartItems } = useCart();


  const handleAddToCart = () => {


    // CHECK CURRENT CART QUANTITY
    const existingItem = cartItems?.find(item => item.id === product.id);
    const currentQuantity = existingItem ? existingItem.quantity : 0;


    // STOCK VALIDATION
    if (currentQuantity + 1 > product.stock) {
      alert("You cannot add more than available stock");
      return;
    }


    const itemToAdd = {
      id: product.id,
      name: product.name,
      image: product.imgUrl || product.image || "/images/no-image.png",
      specs: product.specs || "",
      type: product.type,
      category: product.category,


      price: parseFloat(
        product.type === "rent"
          ? product.rentPrice
          : product.price
      ) || 0,


      quantity: 1,


      stock: product.stock   // ✅ THIS LINE FIXES YOUR PROBLEM
    };


    console.log("Adding to cart:", itemToAdd);


    addToCart(itemToAdd);
  };


  return (
    <div className="product-card">
      <img
        src={product.imgUrl || product.image || "/images/no-image.png"}
        alt={product.name}
      />


      <h3>{product.name}</h3>
      <p className="specs">{product.specs}</p>


      <p className="price">
        ₹{product.type === "rent" ? product.rentPrice || 0 : product.price || 0}
        {product.type === "rent" && <span> /month</span>}
      </p>


      <p className="stock">
        {product.stock > 0 ? `In Stock: ${product.stock}` : "Out of Stock"}
      </p>


      <button
        onClick={handleAddToCart}
        disabled={product.stock === 0}
      >
        {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
      </button>
    </div>
  );
}


export default ProductCard;