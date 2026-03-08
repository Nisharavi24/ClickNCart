import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import {
  onAuthStateChanged,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword
} from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc
} from "firebase/firestore";
import "../styles/editProfile.css";
















const passwordRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=(?:[^0-9]*[0-9]){0,2}[^0-9]*$).{8,20}$/;
















function EditProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
















  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    docId: "",
  });
















  // Password states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
















  // Fetch user data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/", { replace: true });
        return;
      }
















      try {
        const q = query(collection(db, "users"), where("authUid", "==", user.uid));
        const snapshot = await getDocs(q);
















        if (!snapshot.empty) {
          const docSnap = snapshot.docs[0];
          const data = docSnap.data();
          setUserData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            mobile: data.mobile || "",
            email: data.email || "",
            docId: docSnap.id,
          });
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
















      setLoading(false);
    });
















    return () => unsubscribe();
  }, [navigate]);
















  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };
















  // Save Profile
  const handleSave = async () => {
    try {
      await updateDoc(doc(db, "users", userData.docId), {
        firstName: userData.firstName,
        lastName: userData.lastName,
        mobile: userData.mobile,
      });
















      alert("Profile updated successfully!");
      navigate("/dashboard/user");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };
















  // Change Password
  const handleChangePassword = async () => {
    try {
      if (!oldPassword || !newPassword || !confirmPassword) {
        alert("All password fields are required");
        return;
      }
















      if (!passwordRegex.test(newPassword)) {
        alert("New password does not meet criteria");
        return;
      }
















      if (newPassword !== confirmPassword) {
        alert("New passwords do not match");
        return;
      }
















      const user = auth.currentUser;
















      const credential = EmailAuthProvider.credential(
        user.email,
        oldPassword
      );
















      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
















      alert("Password changed successfully!");
















      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(error);
      alert("Old password incorrect or error updating password");
    }
  };
















  if (loading) return <div className="loading">Loading...</div>;
















  return (
    <Layout>
      <div className="edit-profile-page">
        <div className="edit-profile-card">
          <h2>Edit Profile</h2>
















          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={userData.firstName}
            onChange={handleChange}
          />


          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={userData.lastName}
            onChange={handleChange}
          />




          <label>Mobile</label>
          <input
            type="text"
            name="mobile"
            value={userData.mobile}
            onChange={handleChange}
          />


          <div className="buttons">
            <button className="save-btn" onClick={handleSave}>
              Save
            </button>
            <button
              className="cancel-btn"
              onClick={() => navigate("/dashboard/user")}
            >
              Cancel
            </button>
          </div>


          <hr />
          <h3>Change Password</h3>


          <label>Old Password</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />


          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />


          <label>Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />




          <button className="save-btn change-password-btn" onClick={handleChangePassword}>
            Change Password
          </button>
        </div>
      </div>
    </Layout>
  );
}
export default EditProfile;
