import React, { useState } from 'react';
import axios from '../services/axios';
import { useNavigate } from 'react-router-dom';
import '../styles/LoanForm.css'; // ✅ Adjust path if needed

const LoanForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    applicantName: '',
    email: '',
    loanType: '',
    amount: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const applicationData = {
      ...formData,
      status: 'PENDING',
      applicationDate: new Date().toISOString().split('T')[0],
    };

    try {
      await axios.post('/add', applicationData);
      alert('Loan application submitted successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting loan application:', error);
      alert('Submission failed. Please try again.');
    }
  };

  return (
    <div className="loan-form-container">
      <h2>Apply for a Loan</h2>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          type="text"
          name="applicantName"
          value={formData.applicantName}
          onChange={handleChange}
          required
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Loan Type</label>
        <input
          type="text"
          name="loanType"
          value={formData.loanType}
          onChange={handleChange}
          required
        />

        <label>Amount</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          required
        />

        <button type="submit">Submit Application</button>
      </form>
    </div>
  );
};

export default LoanForm;
