import { NavLink } from "react-router-dom";
import { FaHome, FaBox, FaUsers, FaShoppingCart, FaGlobe, FaBars } from "react-icons/fa";
import "../styles/adminSidebar.css";


function AdminSidebar({ collapsed, setCollapsed }) {
  return (
    <div className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>


      {/* HEADER */}
      <div className="sidebar-header">
        <h2 className="sidebar-logo">
          {!collapsed && "ADMIN PANEL"}
        </h2>


        <button className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)}>
          <FaBars />
        </button>
      </div>


      {/* NAV LINKS */}
      <nav>
        <NavLink to="/dashboard/admin">
          <FaHome />
          {!collapsed && <span>Dashboard</span>}
        </NavLink>


        <NavLink to="/admin/products">
          <FaBox />
          {!collapsed && <span>Products</span>}
        </NavLink>


        <NavLink to="/admin/users">
          <FaUsers />
          {!collapsed && <span>Users</span>}
        </NavLink>


        <NavLink to="/admin/orders">
          <FaShoppingCart />
          {!collapsed && <span>Orders</span>}
        </NavLink>


        <NavLink to="/">
          <FaGlobe />
          {!collapsed && <span>Back to Website</span>}
        </NavLink>
      </nav>
    </div>
  );
}


export default AdminSidebar;
