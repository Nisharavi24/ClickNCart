// src/pages/AdminUsers.jsx
import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import "../styles/adminDashboard.css";
import "../styles/adminUsers.css";
import { db } from "../firebase/firebase";
import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";

function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // -------------------- REAL-TIME FETCH USERS --------------------
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        const users = snapshot.docs.map((docSnap) => ({
          id: docSnap.id, // Firestore document ID
          ...docSnap.data(),
          customId: docSnap.data().customId || docSnap.id,
        }));

        setAllUsers(users);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError("Failed to fetch users");
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  // -------------------- SEARCH FILTER --------------------
  useEffect(() => {
    const filtered = allUsers.filter((u) =>
      `${u.customId} ${u.firstName} ${u.lastName} ${u.email} ${u.role}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, allUsers]);

  // -------------------- DELETE USER --------------------
  const handleDelete = async (docId, role) => {
    if (role === "admin") {
      alert("Admin cannot be deleted ❌");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await deleteDoc(doc(db, "users", docId));
      alert("User deleted successfully ✅");
    } catch (error) {
      console.error(error);
      alert("Failed to delete user ❌");
    }
  };

  return (
    <AdminLayout>
      <div className="admin-users-page">
        <button
          className="admin-back-btn"
          onClick={() => window.history.back()}
        >
          ← Back to Dashboard
        </button>

        <h2 className="admin-title">Admin User Management</h2>

        {/* ================= SEARCH CARD ================= */}
        <div className="search-card">
          <h3 className="search-title">Search Users</h3>

          <form className="search-box" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="Search by ID, name, email or role..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setError("");
              }}
            />
            <button disabled>Search</button>
          </form>
        </div>

        {error && <div className="error-text">{error}</div>}

        {/* ================= USERS TABLE ================= */}
        <div className="admin-user-table-container">
          {loading ? (
            <div className="empty-box">Loading...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="empty-box">No users found</div>
          ) : (
            <table className="admin-user-table">
              <thead>
                <tr>
                  <th>Custom ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>{u.customId}</td>

                    <td>
                      {u.firstName} {u.lastName}
                    </td>

                    <td>{u.email}</td>

                    <td>{u.mobile || "-"}</td>

                    <td>
                      <span className={`role-badge ${u.role}`}>
                        {u.role}
                      </span>
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          className="admin-delete-btn"
                          onClick={() => handleDelete(u.id, u.role)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminUsers;