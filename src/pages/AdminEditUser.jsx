import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import "../styles/adminUsers.css";
import { db } from "../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";


function AdminEditUser() {
  const { id } = useParams();
  const navigate = useNavigate();


  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchUser = async () => {
      const snap = await getDoc(doc(db, "users", id));
      if (snap.exists()) {
        setUser({ id: snap.id, ...snap.data() });
      }
      setLoading(false);
    };
    fetchUser();
  }, [id]);


  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };


  const handleUpdate = async () => {
    await updateDoc(doc(db, "users", id), {
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });


    alert("User updated successfully ✅");
    navigate("/admin/users");
  };


  if (loading) return <p style={{ padding: "20px" }}>Loading...</p>;


  return (
    <AdminLayout>
      <div className="admin-users admin-edit-user">


        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back to Admin Management
        </button>


        <h2 className="admin-title">Edit User</h2>


        <div className="table-container">
          <table className="user-table">
            <tbody>


              <tr>
                <td colSpan="2">
                  <label className="edit-label">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={user.name || ""}
                    onChange={handleChange}
                    className="table-input"
                  />
                </td>
              </tr>


              <tr>
                <td colSpan="2">
                  <label className="edit-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={user.email || ""}
                    onChange={handleChange}
                    className="table-input"
                  />
                </td>
              </tr>


              <tr>
                <td colSpan="2">
                  <label className="edit-label">Role</label>
                  <select
                    name="role"
                    value={user.role || "user"}
                    onChange={handleChange}
                    className="table-input"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>


              <tr>
                <td colSpan="2">
                  <label className="edit-label">Status</label>
                  <select
                    name="status"
                    value={user.status || "active"}
                    onChange={handleChange}
                    className="table-input"
                  >
                    <option value="active">Active</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </td>
              </tr>


            </tbody>
          </table>
        </div>


        <button
          className="manage-products-btn"
          style={{ marginTop: "20px" }}
          onClick={handleUpdate}
        >
          Update User
        </button>


      </div>
    </AdminLayout>
  );
}


export default AdminEditUser;
