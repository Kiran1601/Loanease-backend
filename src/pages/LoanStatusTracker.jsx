import React, { useEffect, useState } from "react";
import axios from '../services/axios';
import "../styles/LoanStatusTracker.css";

const LoanStatusTracker = () => {
  const [applications, setApplications] = useState([]);
  const [status, setStatus] = useState("PENDING"); // Default filter
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchApplications(status);
  }, [status]);

  const fetchApplications = async (selectedStatus) => {
    setLoading(true);
    try {
      const response = await axios.get(`/status/${selectedStatus}`);
      setApplications(response.data);
      setMessage(null);
    } catch (error) {
      console.error("Error fetching loan applications:", error);
      setMessage("Failed to fetch applications.");
    }
    setLoading(false);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const updateLoanStatus = async (id, newStatus) => {
    try {
      await axios.put(`/${id}/status`, null, {
        params: { status: newStatus },
      });
      setMessage(`Loan ${id} status updated to ${newStatus}`);
      // Refresh list after update
      fetchApplications(status);
    } catch (error) {
      console.error("Error updating loan status:", error);
      setMessage("Failed to update loan status.");
    }
  };

  return (
    <div className="loan-status-tracker-container">
      <h2>Loan Status Tracker (Admin)</h2>

      <div className="status-filter">
        <label htmlFor="status">Filter by Status: </label>
        <select id="status" value={status} onChange={handleStatusChange}>
          <option value="PENDING">PENDING</option>
          <option value="APPROVED">APPROVED</option>
          <option value="REJECTED">REJECTED</option>
        </select>
      </div>

      {message && <p className="message">{message}</p>}

      {loading ? (
        <p className="loading">Loading applications...</p>
      ) : applications.length === 0 ? (
        <p className="no-applications">No loan applications found with status "{status}".</p>
      ) : (
        <div className="table-container">
            <table className="loan-table">
                <thead>
                    <tr>
                        <th>Application ID</th>
                        <th>Applicant Name</th>
                        <th>Email</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {applications.map((app) => (
                        <tr key={app.id}>
                            <td>{app.id}</td>
                            <td>{app.applicantName || app.name}</td>
                            <td>{app.email}</td>
                            <td>${app.amount}</td>
                            <td>{app.status}</td>
                            <td>
                                {app.status === "PENDING" && (
                                    <>
                                        <button
                                            onClick={() => updateLoanStatus(app.id, "APPROVED")}
                                            className="approve-btn"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => updateLoanStatus(app.id, "REJECTED")}
                                            className="reject-btn"
                                        >
                                            Reject
                                        </button>
                                    </>
                                )}
                                {app.status !== "PENDING" && <em>No actions</em>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      )}
    </div>
  );
};

export default LoanStatusTracker;