import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
function AddProduct() {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("laptop"); // laptop | printer
  const [type, setType] = useState("rent"); // rent | sale
  const [ram, setRam] = useState("");
  const [specs, setSpecs] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [stock, setStock] = useState("");
  const [priceInput, setPriceInput] = useState(""); // 👈 SINGLE PRICE FIELD




  const handleSubmit = async (e) => {
    e.preventDefault();




    // 🔥 BASE PRODUCT DATA
    const productData = {
      name,
      brand,
      category,
      type,
      ram,
      specs,
      imgUrl,
      stock: Number(stock),
      createdAt: new Date(),
    };




    // 🔥 IMPORTANT LOGIC YOU ASKED FOR
    if (type === "rent") {
      productData.rentPrice = Number(priceInput);
    } else {
      productData.price = Number(priceInput);
    }
    try {
      await addDoc(collection(db, "products"), productData);
      alert("Product added successfully ✅");




      // reset form
      setName("");
      setBrand("");
      setRam("");
      setSpecs("");
      setImgUrl("");
      setStock("");
      setPriceInput("");
    } catch (error) {
      console.error(error);
      alert("Error adding product ❌");
    }
  };




  return (
    <div style={{ maxWidth: "500px", margin: "auto" }}>
      <h2>Add Product</h2>




      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />




        <input
          type="text"
          placeholder="Brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          required
        />




        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="laptop">Laptop</option>
          <option value="printer">Printer</option>
        </select>




        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="rent">Rent</option>
          <option value="sale">Sale</option>
        </select>




        <textarea
          placeholder="Specs (CPU / Storage / Printer details)"
          value={specs}
          onChange={(e) => setSpecs(e.target.value)}
          required
        />




        <input
          type="text"
          placeholder="Image URL"
          value={imgUrl}
          onChange={(e) => setImgUrl(e.target.value)}
        />
        <input
          type="number"
          placeholder="Stock Available"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />




        {/* 🔥 SINGLE PRICE FIELD */}
        <input
          type="number"
          placeholder={
            type === "rent"
              ? "Rent Price per Month"
              : "Sale Price"
          }
          value={priceInput}
          onChange={(e) => setPriceInput(e.target.value)}
          required
        />




        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}
export default AddProduct;
