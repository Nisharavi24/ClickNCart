import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/navbar.css";
import { FaShoppingCart, FaSearch, FaUserCircle } from "react-icons/fa";
import { logoutUser } from "../services/authServices";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useCart } from "../context/CartContext";


function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, clearCart } = useCart();


  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [user, setUser] = useState(null);


  // ✅ Admin email
  const adminEmail = "technologiesjeraphic@gmail.com";


  // ✅ Role from localStorage
  const role = localStorage.getItem("role");


  // Get search value from URL
  const queryParams = new URLSearchParams(location.search);
  const searchFromURL = queryParams.get("search") || "";


  const [searchTerm, setSearchTerm] = useState(searchFromURL);


  // Keep input synced with URL
  useEffect(() => {
    setSearchTerm(searchFromURL);
  }, [searchFromURL]);


  // Track Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
    });


    return () => unsubscribe();
  }, []);


  // Search submit
  const handleSubmit = (e) => {
    e.preventDefault();


    if (!searchTerm.trim()) return;


    navigate(`/products?search=${searchTerm}`);
    setOpen(false);
  };


  // Logout
  const handleLogout = async () => {
    try {
      await logoutUser();


      localStorage.removeItem("role");
      localStorage.removeItem("user");


      setUser(null);
      setOpen(false);
      setLoginOpen(false);


      navigate("/login/user", { replace: true });


    } catch (error) {
      alert(error.message);
    }
  };


  // ✅ FINAL ADMIN CHECK
  const isAdmin = role === "admin" || user?.email === adminEmail;


  return (
    <header className="navbar">
     
      {/* LEFT */}
      <div className="nav-left">
        <Link to="/" onClick={() => setOpen(false)}>
          <img src="/logo.png" alt="Jeraphic Logo" className="nav-logo" />
        </Link>


        <div className="brand-text">
          <span className="nav-title">Jeraphic Technologies</span>
          <span className="nav-tagline">Smart IT Solutions</span>
        </div>
      </div>


      {/* CENTER */}
      <div className="nav-center">
       
        {/* SEARCH */}
        <form className="nav-search" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />


          <button type="submit">
            <FaSearch />
          </button>
        </form>


        {/* ✅ CART (COMPLETELY HIDDEN FOR ADMIN) */}
        {!isAdmin && (
          <Link to="/cart" className="nav-cart-wrapper">
            <FaShoppingCart className="nav-cart-icon" />


            {cartItems.length > 0 && (
              <span className="cart-badge">
                {cartItems.length}
              </span>
            )}
          </Link>
        )}


        {/* HAMBURGER */}
        <div
          className={`hamburger ${open ? "open" : ""}`}
          onClick={() => setOpen(!open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>


      {/* MOBILE MENU */}
      {open && (
        <div className="menu">


          <Link to="/" onClick={() => setOpen(false)}>
            Home
          </Link>


          {isAdmin ? (
  <span
    className="menu-link"
    style={{ cursor: "pointer" }}
    onClick={() => {
      alert("Admin cannot Raise Service Requests");
      setOpen(false);
    }}
  >
    Raise Service
  </span>
) : (
  <Link to="/raise-service" onClick={() => setOpen(false)}>
    Raise Service

  </Link>
)}


          {!user ? (
            <>
              <div
                className="dropdown-title"
                onClick={() => setLoginOpen(!loginOpen)}
              >
                Login / Register
                <span className={`arrow ${loginOpen ? "rotate" : ""}`}>
                  ▾
                </span>
              </div>


              {loginOpen && (
                <div className="submenu">


                  <Link
                    to="/login/user"
                    onClick={() => setOpen(false)}
                  >
                    User Login
                  </Link>


                  <Link
                    to="/login/admin"
                    onClick={() => setOpen(false)}
                  >
                    Admin Login
                  </Link>


                  <Link
                    to="/register"
                    onClick={() => setOpen(false)}
                  >
                    Register
                  </Link>


                </div>
              )}
            </>
          ) : (
            <>
              <div className="dropdown-title">
                <FaUserCircle style={{ marginRight: "8px" }} />
                My Account
              </div>


              <button
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}


          <Link to="/about" onClick={() => setOpen(false)}>
            About Us
          </Link>


          <Link to="/contact" onClick={() => setOpen(false)}>
            Contact
          </Link>


          <Link to="/faq" onClick={() => setOpen(false)}>
            FAQ
          </Link>


        </div>
      )}
    </header>
  );
}


export default Navbar;
