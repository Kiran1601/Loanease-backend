import React, { useEffect, useState } from 'react';
import axios from '../services/axios';
import {jwtDecode} from 'jwt-decode';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const email = decoded.sub;

        axios.get(`/applicant/${email}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((res) => {
          setApplications(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching applications:", err);
          setLoading(false);
        });
      } catch (error) {
        console.error("Invalid token", error);
        setLoading(false);
      }
    } else {
      console.warn("No token found");
      setLoading(false);
    }
  }, []);

  return (
    <div className="container mt-4">
      <h2>My Loan Applications</h2>

      {loading ? (
        <p>Loading applications...</p>
      ) : applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <table className="table table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>ID</th>
              <th>Loan Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Application Date</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td>{app.id}</td>
                <td>{app.loanType}</td>
                <td>${app.amount}</td>
                <td>{app.status}</td>
                <td>{app.applicationDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyApplications;
