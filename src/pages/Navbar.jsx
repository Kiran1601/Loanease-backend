import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const payload = jwtDecode(token);
                setIsAdmin(payload.role === "ADMIN");
                setIsLoggedIn(true);
            } catch (error) {
                console.error("Failed to parse token", error);
                setIsLoggedIn(false);
                setIsAdmin(false);
            }
        } else {
            setIsLoggedIn(false);
            setIsAdmin(false);
        }
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("isAdmin");
        setIsLoggedIn(false);
        setIsAdmin(false);
        navigate("/");
    };

    if (!isLoggedIn) {
        return (
            <nav style={styles.nav}>
                <h2 style={styles.brand}>LoanEase</h2>
            </nav>
        );
    }

    return (
        <nav style={styles.nav}>
            <h2 style={styles.brand}>LoanEase</h2>
            <ul style={styles.links}>
                {/* User links - visible to all users, but some are admin-only */}
                <li><Link to="/dashboard" style={styles.link}> Dashboard </Link></li>
                <li><Link to="/loan-form" style={styles.link}> Apply Loan</Link></li>

                {/* User-only links (non-admin) */}
                {!isAdmin && (
                    <li><Link to="/my-loan-history" style={styles.link}>My Loan History</Link></li>
                )}

                {/* Admin-only links */}
                {isAdmin && (
                    <>
                        <li><Link to="/all-applications" style={styles.link}> All Applications</Link></li>
                        <li><Link to="/get-by-email" style={styles.link}> By Email</Link></li>
                        <li><Link to="/update-delete" style={styles.link}> Update/Delete</Link></li>
                        <li><Link to="/admin" style={styles.link}> Admin</Link></li>
                        <li><Link to="/loan-status-tracker" style={styles.link}> Loan Status Tracker</Link></li>
                        <li><Link to="/all-status-history" style={styles.link}> All Status History</Link></li>
                    </>
                )}
            </ul>
            <button style={styles.logoutButton} onClick={handleLogout}>
                Logout
            </button>
        </nav>
    );
};

const styles = {
    nav: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#0077cc",
        padding: "10px 20px",
    },
    brand: {
        color: "#fff",
        margin: 0,
    },
    links: {
        listStyle: "none",
        display: "flex",
        gap: "15px",
        margin: 0,
        padding: 0,
    },
    link: {
        color: "#fff",
        textDecoration: "none",
        fontWeight: "bold",
    },
    logoutButton: {
        backgroundColor: "#ff4d4d",
        color: "#fff",
        border: "none",
        padding: "8px 12px",
        cursor: "pointer",
        borderRadius: "4px",
        fontWeight: "bold",
    },
};

export default Navbar;