import React, { useState } from 'react';
import axios from '../services/axios';

const UpdateDeleteLoan = () => {
  const [id, setId] = useState('');
  const [loan, setLoan] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [message, setMessage] = useState('');

  const token = localStorage.getItem("token");

  const fetchLoan = () => {
    axios.get(`/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setLoan(res.data);
      setNewStatus(res.data.status);
      setMessage('');
    })
    .catch(err => {
      setLoan(null);
      setMessage('Loan not found');
      console.error(err);
    });
  };

  const updateStatus = () => {
    axios.put(`/${id}/status?status=${newStatus}`, null, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setLoan(res.data);
      setMessage('Status updated successfully');
    })
    .catch(err => {
      console.error(err);
      setMessage('Failed to update status');
    });
  };

  const deleteLoan = () => {
    axios.delete(`/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      setLoan(null);
      setId('');
      setMessage('Loan deleted successfully');
    })
    .catch(err => {
      console.error(err);
      setMessage('Failed to delete loan');
    });
  };

  return (
    <div className="container mt-4">
      <h2>Update or Delete Loan</h2>

      <div className="form-group w-50">
        <label>Enter Loan ID:</label>
        <input
          type="number"
          className="form-control"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={fetchLoan}>Fetch Loan</button>
      </div>

      {loan && (
        <div className="mt-4">
          <h4>Loan Details</h4>
          <p><strong>Name:</strong> {loan.applicantName}</p>
          <p><strong>Email:</strong> {loan.email}</p>
          <p><strong>Type:</strong> {loan.loanType}</p>
          <p><strong>Amount:</strong> ${loan.amount}</p>
          <p><strong>Date:</strong> {loan.applicationDate}</p>

          <div className="form-group mt-3 w-50">
            <label>Update Status:</label>
            <select
              className="form-control"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="PENDING">PENDING</option>
              <option value="APPROVED">APPROVED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
            <button className="btn btn-success mt-2" onClick={updateStatus}>Update Status</button>
          </div>

          <button className="btn btn-danger mt-3" onClick={deleteLoan}>Delete Loan</button>
        </div>
      )}

      {message && <div className="alert alert-info mt-4">{message}</div>}
    </div>
  );
};

export default UpdateDeleteLoan;
