import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { loginAdmin } from "../services/authServices";
import "../styles/adminLogin.css";  




function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();




  const emailName = "email_" + Math.random().toString(36).substring(2, 8);
  const passwordName = "password_" + Math.random().toString(36).substring(2, 8);




  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await loginAdmin(email, password);
      localStorage.setItem("role", user.role);
      navigate("/dashboard/admin");
    } catch (err) {
      alert(err.message);
    }
  };




  return (
    <Layout>
      <div className="admin-login-page">
        <div className="form-box">
          <h2>Admin Login</h2>




          <form onSubmit={handleSubmit} autoComplete="off">
            <input type="text" style={{ display: "none" }} />




            <input
              type="email"
              name={emailName}
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />




            <input
              type="password"
              name={passwordName}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />




            <button type="submit" className="admin-login-btn">
              Login
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}




export default AdminLogin;
//DON'T  CHANGE
