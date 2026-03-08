import React, { useState } from "react";
import Layout from "../components/Layout";
import { forgotPassword } from "../services/authServices";
















function ForgotPassword() {
  const [email, setEmail] = useState("");
















  const handleSubmit = async (e) => {
    e.preventDefault();
















    if (!email) {
      alert("Please enter your email");
      return;
    }
















    try {
      await forgotPassword(email);
      alert("Password reset link sent to your email 📧");
    } catch (error) {
      alert(error.message);
    }
  };


  return (
    <Layout>
      <div className="form-box">
        <h2>Forgot Password</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />


          <button type="submit">Send Reset Link</button>
        </form>
      </div>
    </Layout>
  );
}


export default ForgotPassword;


