// src/pages/AdminProducts.jsx
import React, { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import "../styles/adminProducts.css";
import { db } from "../firebase/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";


function AdminProducts() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);


  const [formData, setFormData] = useState({
    brand: "",
    category: "",
    type: "rent",
    amount: "",
    specs: "",
    imgUrl: "",
    stock: "", // ✅ STOCK FIELD
  });


  // -------------------- FETCH PRODUCTS --------------------
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const productList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));


      setProducts(productList);
      setFilteredProducts(productList);
    });


    return () => unsubscribe();
  }, []);


  // -------------------- SEARCH FILTER --------------------
  const handleSearch = (e) => {
    e.preventDefault();
    const filtered = products.filter((p) =>
      `${p.brand} ${p.category} ${p.specs}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  };


  // -------------------- FORM HANDLING --------------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleAddOrUpdate = async (e) => {
    e.preventDefault();


    const productData = {
      brand: formData.brand,
      name: formData.brand,
      category: formData.category.toLowerCase(),
      type: formData.type,
      specs: formData.specs,
      imgUrl: formData.imgUrl,
      stock: Number(formData.stock), // ✅ CONNECTED TO FIRESTORE
    };


    if (formData.type === "rent") {
      productData.rentPrice = Number(formData.amount);
      productData.price = null;
    } else {
      productData.price = Number(formData.amount);
      productData.rentPrice = null;
    }


    try {
      if (editingId) {
        await updateDoc(doc(db, "products", editingId), productData);
        alert("Product updated ✅");
      } else {
        await addDoc(collection(db, "products"), productData);
        alert("Product added ✅");
      }


      setFormData({
        brand: "",
        category: "",
        type: "rent",
        amount: "",
        specs: "",
        imgUrl: "",
        stock: "",
      });


      setEditingId(null);
    } catch (error) {
      console.error(error);
      alert("Error saving product ❌");
    }
  };


  const handleEdit = (p) => {
    setFormData({
      brand: p.brand,
      category: p.category,
      type: p.type,
      amount: p.type === "rent" ? p.rentPrice : p.price,
      specs: p.specs,
      imgUrl: p.imgUrl || "",
      stock: p.stock || "", // ✅ LOAD STOCK
    });
    setEditingId(p.id);


    // Scroll to Add/Edit card
    const section = document.getElementById("edit-section");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };


  const handleDelete = async (id) => {
    if (!window.confirm("Delete product?")) return;
    await deleteDoc(doc(db, "products", id));
  };


  return (
    <AdminLayout>
      <div className="admin-products-page">
        <button
          className="admin-back-btn"
          onClick={() => navigate("/dashboard/admin")}
        >
          ← Back to Dashboard
        </button>


        <h2 className="admin-title">Admin Product Management</h2>


        {/* -------------------- ADD / EDIT PRODUCT -------------------- */}
        <div
          id="edit-section"
          style={{
            marginBottom: "30px",
            padding: "20px",
            background: "#ffffff",
            borderRadius: "14px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
          }}
        >
          <h3 className="search-title">{editingId ? "Edit Product" : "Add Product"}</h3>


          <form className="admin-product-form" onSubmit={handleAddOrUpdate}>
            <input
              type="text"
              name="brand"
              placeholder="Brand"
              value={formData.brand}
              onChange={handleChange}
              required
            />


            <input
              type="text"
              name="category"
              placeholder="Category (laptop/printer)"
              value={formData.category}
              onChange={handleChange}
              required
            />


            <div style={{ gridColumn: "span 2", marginTop: "5px" }}>
              <label>
                <input
                  type="radio"
                  name="type"
                  value="rent"
                  checked={formData.type === "rent"}
                  onChange={handleChange}
                />
                Rent
              </label>


              <label style={{ marginLeft: "15px" }}>
                <input
                  type="radio"
                  name="type"
                  value="sale"
                  checked={formData.type === "sale"}
                  onChange={handleChange}
                />
                Sale
              </label>
            </div>


            <input
              type="number"
              name="amount"
              placeholder={formData.type === "rent" ? "Price/Month" : "Sale Price"}
              value={formData.amount}
              onChange={handleChange}
              required
            />


            {/* ✅ STOCK FIELD */}
            <input
              type="number"
              name="stock"
              placeholder="Stock Quantity"
              value={formData.stock}
              onChange={handleChange}
              required
            />


            <input
              type="text"
              name="specs"
              placeholder="Specs"
              value={formData.specs}
              onChange={handleChange}
            />


            <input
              type="text"
              name="imgUrl"
              placeholder="Image URL"
              value={formData.imgUrl}
              onChange={handleChange}
            />


            {formData.imgUrl && (
              <img
                src={formData.imgUrl}
                alt="Preview"
                style={{ width: "120px", marginTop: "10px", borderRadius: "8px" }}
              />
            )}


            <button type="submit">
              {editingId ? "Update Product" : "Add Product"}
            </button>
          </form>
        </div>


        {/* -------------------- SEARCH -------------------- */}
        <div className="search-card">
          <h3 className="search-title">Search Products</h3>
          <form className="search-box" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search by brand, category, or specs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
        </div>


        {/* -------------------- PRODUCT TABLE -------------------- */}
        <div className="admin-product-table-container">
          {loading ? (
            <p>Loading...</p>
          ) : filteredProducts.length === 0 ? (
            <p>No products found</p>
          ) : (
            <table className="admin-product-table">
              <thead>
                <tr>
                  <th>Brand</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Stock</th> {/* ✅ STOCK COLUMN */}
                  <th>Specs</th>
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>


              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.id}>
                    <td>{p.brand}</td>
                    <td>{p.category}</td>
                    <td>{p.type}</td>
                    <td>
                      {p.type === "rent"
                        ? `₹${p.rentPrice}/month`
                        : `₹${p.price}`}
                    </td>
                    <td>{p.stock}</td> {/* ✅ SHOW STOCK */}
                    <td>{p.specs}</td>
                    <td>
                      {p.imgUrl ? (
                        <img
                          src={p.imgUrl}
                          alt={p.brand}
                          style={{ width: "70px", borderRadius: "6px" }}
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>
                    <td>
                      <button
                        className="admin-edit-btn"
                        onClick={() => handleEdit(p)}
                      >
                        Edit
                      </button>
                      <button
                        className="admin-delete-btn"
                        onClick={() => handleDelete(p.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}


export default AdminProducts;


