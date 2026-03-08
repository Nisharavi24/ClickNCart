import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { loginUser, googleLogin } from "../services/authServices";
import { FcGoogle } from "react-icons/fc";








function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");








  useEffect(() => {
    setEmail("");
    setPassword("");
  }, []);








  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await loginUser(email, password);
      localStorage.setItem("role", user.role || "customer");
      alert(`Login successful! Welcome ${user.email}`);
      navigate("/dashboard/user", { replace: true });
    } catch (err) {
      console.log("Login error:", err.code);








      if (err.code === "auth/user-not-found" || err.code === "auth/invalid-credential") {
        alert("User not found. Please register.");
        navigate("/register");
      } else if (err.code === "auth/wrong-password") {
        alert("Incorrect password. Please try again.");
      } else {
        alert("Login failed. Please try again.");
      }








      setEmail("");      // Clear email on failure
      setPassword("");   // Clear password on failure
    }
  };








  const handleGoogleLogin = async () => {
    try {
      const user = await googleLogin();
      localStorage.setItem("role", user.role || "customer");
      alert(`Google login successful! Welcome ${user.email}`);
      navigate("/dashboard/user", { replace: true });
    } catch (err) {
      console.log("Google login error:", err.code);








      if (err.code === "auth/user-not-found" || err.code === "auth/invalid-credential") {
        alert("User not found. Please register.");
        navigate("/register");
      } else {
        alert("Google login failed. Please try again.");
      }








      setEmail("");
      setPassword("");
    }
  };








  return (
    <Layout>
      <div
        style={{
          maxWidth: "450px",
          margin: "50px auto",
          padding: "35px",
          borderRadius: "15px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "30px",
            color: "#1e40af",
            fontWeight: "700",
            fontSize: "2rem",
          }}
        >
          Login
        </h2>








        <form onSubmit={handleSubmit} autoComplete="off">
          <input type="text" style={{ display: "none" }} />








          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="off"
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "1rem",
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "20px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "1rem",
            }}
          />








          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#1e40af",
              color: "#fff",
              fontSize: "1.05rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "0.3s",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#1e40af")}
          >
            Login
          </button>
        </form>








        {/* Forgot Password and Register */}
        <div
          style={{
            marginTop: "15px",
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.95rem",
          }}
        >
          <a
            href="/forgot-password"
            style={{
              color: "#1e40af",
              textDecoration: "underline",
              fontWeight: "500",
            }}
          >
            Forgot Password?
          </a>








          <span
            style={{
              color: "#1e40af",
              textDecoration: "underline",
              cursor: "pointer",
              fontWeight: "500",
            }}
            onClick={() => navigate("/register")}
          >
            New User? Register
          </span>
        </div>








        {/* Google Login */}
        <button
          type="button"
          style={{
            marginTop: "20px",
            background: "#fff",
            color: "#000",
            width: "100%",
            padding: "12px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            cursor: "pointer",
            transition: "0.3s",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#f1f1f1";
            e.target.style.borderColor = "#1e40af";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#fff";
            e.target.style.borderColor = "#ccc";
          }}
          onClick={handleGoogleLogin}
        >
          <FcGoogle style={{ fontSize: "1.5rem" }} />
          Login with Google
        </button>
      </div>
    </Layout>
  );
}








export default Login;
