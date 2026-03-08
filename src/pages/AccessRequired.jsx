import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import "../styles/accessRequired.css";




function AccessRequired() {
  const navigate = useNavigate();




  return (
    <Layout>
      <div className="access-required-page">
        <div className="card">
          <h2>Access Denied</h2>
          <p>
            You must <strong>login or create an account</strong> to view this page.
          </p>
          <div className="buttons">
            <button
              onClick={() => navigate("/login/user")}
              className="primary-btn"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="secondary-btn"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}




export default AccessRequired;
