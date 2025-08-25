import React, { useEffect, useState } from 'react';
import axios from '../services/axios';
import "../styles/AllApplications.css";

const AllApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get("/getAll", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      setApplications(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.error("Error fetching all applications", err);
      setLoading(false);
    });
  }, []);

  return (
    <div className="all-applications-container">
      <h2>All Loan Applications</h2>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : applications.length === 0 ? (
        <p className="no-data">No applications found.</p>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Applicant Name</th>
                <th>Email</th>
                <th>Loan Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app.id}>
                  <td>{app.id}</td>
                  <td>{app.applicantName}</td>
                  <td>{app.email}</td>
                  <td>{app.loanType}</td>
                  <td>${app.amount}</td>
                  <td>{app.status}</td>
                  <td>{app.applicationDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllApplications;
