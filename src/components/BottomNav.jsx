import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaSyncAlt, FaTag, FaUser } from "react-icons/fa";
import "../styles/bottomnav.css";


function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("q") || "";


  const isRent = location.pathname.startsWith("/rent");
  const isSale = location.pathname.startsWith("/sale");


  // Handle account click
  const handleAccountClick = () => {
    const userRole = localStorage.getItem("role");


    if (!userRole) {
      navigate("/access-required", { replace: false });
      return;
    }


    if (userRole === "admin") {
      navigate("/dashboard/admin", { replace: false });
    } else {
      navigate("/dashboard/user", { replace: false });
    }
  };


  // Determine if Account should be active
  const isAccountActive =
    location.pathname.startsWith("/dashboard/user") ||
    location.pathname.startsWith("/dashboard/admin") ||
    location.pathname.startsWith("/my-orders") ||
    location.pathname === "/access-required";


  return (
    <div className="bottom-nav">


      {/* HOME */}
      <NavLink
        to="/"
        className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
      >
        <FaHome />
        <span>Home</span>
      </NavLink>


      {/* RENT */}
      <NavLink
        to={`/rent/laptop${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ""}`}
        className={() => (isRent ? "nav-item active" : "nav-item")}
      >
        <FaSyncAlt />
        <span>Rent</span>
      </NavLink>


      {/* SALE */}
      <NavLink
        to={`/sale/laptop${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ""}`}
        className={() => (isSale ? "nav-item active" : "nav-item")}
      >
        <FaTag />
        <span>Sale</span>
      </NavLink>


      {/* ACCOUNT */}
      <button
        className={isAccountActive ? "nav-item active" : "nav-item"}
        onClick={handleAccountClick}
      >
        <FaUser />
        <span>Account</span>
      </button>


    </div>
  );
}


export default BottomNav;
