import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import ProductCard from "../components/ProductCard";
import "../styles/products.css";




function Products() {
  const { type, category } = useParams();
  const location = useLocation();
  const navigate = useNavigate(); // ✅ Added




  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search")?.toLowerCase().trim() || "";




  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);




  // Toggle State (for active button styling only)
  const [selectedCategory, setSelectedCategory] = useState(category || "");




  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);




        const snapshot = await getDocs(collection(db, "products"));
        const allProducts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));




        let filteredProducts = allProducts;




        // 🔍 SEARCH FILTERING
        if (searchQuery) {
          const searchWords = searchQuery.split(" ").filter(Boolean);




          filteredProducts = allProducts.filter((p) => {
            const name = (p.name || "").toLowerCase();
            const brand = (p.brand || "").toLowerCase();
            const specs = (p.specs || "").toLowerCase();
            const productCategory = (p.category || "").toLowerCase();
            const productType = (p.type || "").toLowerCase();




            const productData = `${name} ${brand} ${specs} ${productCategory} ${productType}`;




            return searchWords.every((word) => {
              const singular = word.endsWith("s")
                ? word.slice(0, -1)
                : word;




              return (
                productData.includes(word) ||
                productData.includes(singular)
              );
            });
          });
        }




        // 📂 NORMAL URL FILTERING
        else {
          filteredProducts = allProducts.filter((p) => {
            const matchesType =
              !type || p.type?.toLowerCase() === type.toLowerCase();




            const matchesCategory =
              !category ||
              p.category?.toLowerCase() === category.toLowerCase();




            return matchesType && matchesCategory;
          });
        }




        setProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };




    fetchProducts();
  }, [type, category, location.search]);




  return (
    <div className="products-page">
      <h2 className="products-title">
        {searchQuery
          ? `Search Results for "${searchQuery}"`
          : type
          ? type === "rent"
            ? "Rental Products"
            : "Sale Products"
          : "All Products"}
      </h2>




      {/* ✅ CATEGORY TOGGLE (URL BASED) */}
      {!searchQuery && type && (
        <div className="toggle-container">
          <button
            className={category === "laptop" ? "toggle-btn active" : "toggle-btn"}
            onClick={() => navigate(`/${type}/laptop`)}
          >
            Laptop
          </button>




          <button
            className={category === "printer" ? "toggle-btn active" : "toggle-btn"}
            onClick={() => navigate(`/${type}/printer`)}
          >
            Printer
          </button>
        </div>
      )}




      {loading ? (
        <p className="loading">Loading products...</p>
      ) : (
        <div className="products-grid">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="no-products">No products found.</p>
          )}
        </div>
      )}
    </div>
  );
}




export default Products;
