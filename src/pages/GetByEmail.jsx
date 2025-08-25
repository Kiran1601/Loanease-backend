import React, { useState } from 'react';
import axios from '../services/axios';

const GetByEmail = () => {
  const [email, setEmail] = useState('');
  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState('');

  const token = localStorage.getItem("token");

  const handleSearch = () => {
    if (!email) {
      setMessage("Please enter an email.");
      return;
    }

    axios.get(`/applicant/${email}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setApplications(res.data);
      if (res.data.length === 0) {
        setMessage("No applications found for this email.");
      } else {
        setMessage('');
      }
    })
    .catch(err => {
      console.error(err);
      setMessage("Error fetching applications.");
    });
  };

  return (
    <div className="container mt-4">
      <h2>Get Applications by Email</h2>
      
      <div className="form-group w-50">
        <label>Enter Applicant Email:</label>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={handleSearch}>Search</button>
      </div>

      {message && <div className="alert alert-info mt-3">{message}</div>}

      {applications.length > 0 && (
        <div className="mt-4">
          <h4>Loan Applications</h4>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Applicant Name</th>
                <th>Email</th>
                <th>Loan Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Application Date</th>
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

export default GetByEmail;
