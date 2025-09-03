import React from 'react';

const LoginPage = () => {
  const handleLogin = () => {
    window.location.href = 'http://localhost:9009/oauth2/authorization/google';
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to <span style={styles.brand}>LoanEase</span></h1>
      <p style={styles.subtitle}>Your trusted platform for faster, smarter loan management</p>
      <button onClick={handleLogin} style={styles.googleButton}>
        Sign in with Google
      </button>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    marginTop: '120px',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    fontSize: '2.5rem',
    color: '#0077cc',
  },
  brand: {
    color: '#005599',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: '1.2rem',
    marginBottom: '30px',
    color: '#444',
  },
  googleButton: {
    backgroundColor: '#4285F4',
    color: '#fff',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
};

export default LoginPage;
