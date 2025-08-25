import React, { useEffect, useState } from "react";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [tokenPayload, setTokenPayload] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const payload = JSON.parse(atob(token.split('.')[1]));
    setTokenPayload(payload);
  }, []);

  if (!tokenPayload || tokenPayload.role !== "ADMIN") {
    return <h2 className="access-denied">Access Denied. Admins only.</h2>;
  }

  return (
   <div className="admin-dashboard-container">
    <div className="admin-dashboard-card">
      <h1>Admin Dashboard</h1>
      <table className="admin-info-table">
        <tbody>
          <tr>
            <td className="label">Welcome</td>
            <td className="value">{tokenPayload.name}</td>
          </tr>
          <tr>
            <td className="label">Email</td>
            <td className="value">{tokenPayload.sub}</td>
          </tr>
          <tr>
            <td className="label">Role</td>
            <td className="value">{tokenPayload.role}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  );
};

export default AdminDashboard;
