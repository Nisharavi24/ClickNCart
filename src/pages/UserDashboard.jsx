import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import Layout from "../components/Layout";
import { logoutUser } from "../services/authServices";
import { updateUserProfile } from "../services/userServices";
import { FaBoxOpen, FaTools, FaPhone, FaUserEdit } from "react-icons/fa";
import "../styles/userDashboard.css";




function UserDashboard() {
  const navigate = useNavigate();




  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);




  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
  });




  // 🔐 AUTH + FETCH USER
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/", { replace: true });
        return;
      }




      try {
        const q = query(
          collection(db, "users"),
          where("authUid", "==", user.uid)
        );
        const snapshot = await getDocs(q);




        if (!snapshot.empty) {
          const docSnap = snapshot.docs[0];
          const data = docSnap.data();




          setCurrentUser({
            docId: docSnap.id,
            authUid: user.uid,
            email: data.email,
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            mobile: data.mobile || "",
            role: data.role,
          });




          setFormData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            mobile: data.mobile || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }




      setLoading(false);
    });




    return () => unsubscribe();
  }, [navigate]);




  // ✏️ INPUT HANDLER
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };




  // 💾 SAVE PROFILE
  const handleSave = async () => {
    try {
      await updateUserProfile(currentUser.docId, formData);




      setCurrentUser({
        ...currentUser,
        ...formData,
      });




      setEditMode(false);
      alert("Profile updated successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to update profile");
    }
  };




  // 🚪 LOGOUT
  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.clear();
      sessionStorage.clear();
      navigate("/", { replace: true });
    } catch (error) {
      console.log(error.message);
    }
  };




  if (loading) return <div className="loading">Loading...</div>;




  return (
    <Layout>
      <div className="account-page">
        {/* Header */}
        <div className="account-header">
          <h2>My Account</h2>
        </div>




        {/* User Card */}
        <div className="user-card">
          <img
            src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
            alt="User Avatar"
            className="avatar"
          />




          <div className="user-details">
            <h3>
              {currentUser.firstName} {currentUser.lastName}
            </h3>
            <p>{currentUser.email}</p>




            {/* Logout button */}
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>




        {/* Menu Cards */}
        <div className="menu-cards">
          <div
            className="menu-card"
            onClick={() => navigate("/my-orders")}
          >
            <FaBoxOpen className="menu-icon" />
            <span>My Orders</span>
          </div>




          <div
            className="menu-card"
            onClick={() => navigate("/dashboard/my-services")}
          >
            <FaTools className="menu-icon" />
            <span>My Services</span>
          </div>




          <div
            className="menu-card"
            onClick={() => navigate("/contact-us")}
          >
            <FaPhone className="menu-icon" />
            <span>Contact Us</span>
          </div>




          <div
            className="menu-card"
            onClick={() => navigate("/dashboard/edit-profile")}
          >
            <FaUserEdit className="menu-icon" />
            <span>Edit Profile</span>
          </div>
        </div>




        {/* Edit Profile Modal */}
        {editMode && (
          <div className="edit-profile-modal">
            <h3>Edit Profile</h3>
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
            />
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
            />
            <input
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Mobile"
            />
            <div className="profile-actions">
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setEditMode(false)}>Cancel</button>
            </div>
          </div>
        )}




        {/* Welcome */}
        <div className="welcome-card">
          <h3>Welcome To Your Account</h3>
          <p>
            Hi <strong>{currentUser.firstName} {currentUser.lastName}</strong>, you
            can manage your orders, profile, and contact options from here.
          </p>
        </div>
      </div>
    </Layout>
  );
}




export default UserDashboard;
