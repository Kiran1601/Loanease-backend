import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");

        if (storedToken) {
            try {
                const decoded = jwtDecode(storedToken);
                setUser(decoded);
            } catch (err) {
                console.error("Failed to decode stored token", err);
            }
        } else {
            const queryParams = new URLSearchParams(window.location.search);
            const token = queryParams.get("token");

            if (token) {
                localStorage.setItem("token", token);
                try {
                    const decoded = jwtDecode(token);
                    setUser(decoded);
                } catch (err) {
                    console.error("Failed to decode token", err);
                }
            }
        }
    }, []);

    return (
        <div className="dashboard-container">
            <h2 className="dashboard-header">Welcome to LoanEase Dashboard!</h2>

            {user && (
                <div className="user-info">
                    <p><span className="label">Name:</span> {user.name}</p>
                    <p><span className="label">Email:</span> {user.sub}</p>
                    <p><span className="label">Role:</span> {user.role}</p>
                </div>
            )}
            
            <hr />
        </div>
    );
};

export default Dashboard;