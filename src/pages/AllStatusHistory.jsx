import React, { useEffect, useState } from 'react';
import axios from '../services/axios';
import '../styles/AllStatusHistory.css';

const AllStatusHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get("/getAllStatusHistory", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      setHistory(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.error("Error fetching all status history", err);
      setLoading(false);
    });
  }, []);

  return (
    <div className="all-history-container">
      <h2>All Loan Status History</h2>
      {loading ? (
        <p className="loading">Loading...</p>
      ) : history.length === 0 ? (
        <p className="no-data">No status history records found.</p>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Application ID</th>
                <th>Previous Status</th>
                <th>New Status</th>
                <th>Changed By</th>
                <th>Changed At</th>
              </tr>
            </thead>
            <tbody>
              {history.map(record => (
                <tr key={record.id}>
                  <td>{record.id}</td>
                  <td>{record.applicationId}</td>
                  <td>{record.oldStatus}</td>
                  <td>{record.newStatus}</td>
                  <td>{record.changedBy}</td>
                  <td>{new Date(record.changedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllStatusHistory;