import React, { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import "../styles/adminDashboard.css";
import { Link } from "react-router-dom";


import { db } from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";


import {
  Users,
  Package,
  ShoppingCart,
  Settings
} from "lucide-react";


function AdminDashboard() {


  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
  });


  useEffect(() => {
    const fetchStats = async () => {
      try {
        const usersSnap = await getDocs(collection(db, "users"));
        const productsSnap = await getDocs(collection(db, "products"));
        const ordersSnap = await getDocs(collection(db, "orders"));


        setStats({
          users: usersSnap.size,
          products: productsSnap.size,
          orders: ordersSnap.size,
        });
      } catch (err) {
        console.error(err);
      }
    };


    fetchStats();
  }, []);


  return (
    <AdminLayout>
      <div className="admin-dashboard-page">


        {/* HEADING */}
        <h1 className="admin-dashboard-heading">
          ADMIN DASHBOARD
        </h1>


        {/* STATS */}
        <div className="dashboard-grid">


          <div className="dashboard-card">
            <div className="dashboard-card-title">Total Users</div>
            <div className="dashboard-card-number">{stats.users}</div>
          </div>


          <div className="dashboard-card">
            <div className="dashboard-card-title">Total Products</div>
            <div className="dashboard-card-number">{stats.products}</div>
          </div>


          <div className="dashboard-card">
            <div className="dashboard-card-title">Total Orders</div>
            <div className="dashboard-card-number">{stats.orders}</div>
          </div>


        </div>


        {/* ACTION TILES */}
        <div className="action-tiles">


          <Link to="/admin/users" className="action-tile blue">
            <Users size={70} />
            <span>Manage Users</span>
          </Link>


          <Link to="/admin/products" className="action-tile green">
            <Package size={70} />
            <span>Manage Products</span>
          </Link>


          <Link to="/admin/manage-orders" className="action-tile orange">
            <ShoppingCart size={70} />
            <span>Manage Orders</span>
          </Link>


          <Link to="/manage-services" className="action-tile red">
            <Settings size={70} />
            <span>Manage Services</span>
          </Link>


        </div>


      </div>
    </AdminLayout>
  );
}


export default AdminDashboard;
