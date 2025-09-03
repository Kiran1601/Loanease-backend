import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from '../services/axios';
import '../styles/MyLoanHistory.css';

const MyLoanHistory = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Authentication token not found. Please log in.");
                setLoading(false);
                return;
            }

            try {
                const decoded = jwtDecode(token);
                const userEmail = decoded.sub;

                // Fetch all loan applications for the logged-in user
                const applicationsResponse = await axios.get(`/applicant/${userEmail}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const userApps = applicationsResponse.data;

                // If no applications are found, we can stop here
                if (userApps.length === 0) {
                    setApplications([]);
                    setLoading(false);
                    return;
                }

                // For each application, fetch its status history
                const appsWithHistory = await Promise.all(
                    userApps.map(async (app) => {
                        try {
                            const historyResponse = await axios.get(`/my-status-history/${app.id}`, {
                                headers: { Authorization: `Bearer ${token}` }
                            });
                            return { ...app, history: historyResponse.data };
                        } catch (historyErr) {
                            console.error(`Error fetching history for application ID ${app.id}`, historyErr);
                            // If history fetch fails, return the application without history data
                            return { ...app, history: [] };
                        }
                    })
                );

                setApplications(appsWithHistory);
            } catch (err) {
                console.error("Error fetching user data:", err);
                // Check for a specific 403 Forbidden error from the server
                if (err.response && err.response.status === 403) {
                    setError("Access denied. You do not have permission to view this data.");
                } else {
                    setError("Failed to fetch your applications and history. Please try again.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return <div className="history-container"><p className="loading">Loading your applications and history...</p></div>;
    }

    if (error) {
        return <div className="history-container"><p className="error">{error}</p></div>;
    }

    if (applications.length === 0) {
        return <div className="history-container"><p className="no-data">You have not submitted any loan applications yet.</p></div>;
    }

    return (
        <div className="history-container">
            <h2>My Loan Applications and History</h2>
            {applications.map((app) => (
                <div key={app.id} className="application-card">
                    <h3>Application Details</h3>
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>Application ID</th>
                                <th>Loan Type</th>
                                <th>Amount</th>
                                <th>Current Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{app.id}</td>
                                <td>{app.loanType}</td>
                                <td>${app.amount}</td>
                                <td>{app.status}</td>
                            </tr>
                        </tbody>
                    </table>
                    
                    {app.history && app.history.length > 0 ? (
                        <div className="history-section">
                            <h4>Status History</h4>
                            <table className="history-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Old Status</th>
                                        <th>New Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {app.history.map((record) => (
                                        <tr key={record.id}>
                                            <td>{new Date(record.changedAt).toLocaleString()}</td>
                                            <td>{record.oldStatus}</td>
                                            <td>{record.newStatus}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="no-history">No status history found for this application yet.</p>
                    )}
                </div>
            ))}
        </div>
    );
}; 

export default MyLoanHistory;