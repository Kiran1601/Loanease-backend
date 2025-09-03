import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import './styles/App.css';
import Dashboard from './pages/Dashboard';
import OAuth2RedirectHandler from './pages/OAuth2RedirectHandler';
import LoanForm from './pages/LoanForm';
import MyApplications from './pages/MyApplications';
import AllApplications from './pages/AllApplications';
import UpdateDeleteLoan from './pages/UpdateDeleteLoan';
import GetByEmail from './pages/GetByEmail';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './LoginPage';
import Navbar from './pages/Navbar';
import LoanStatusTracker from './pages/LoanStatusTracker';
import MyLoanHistory from './pages/MyLoanHistory';
import AllStatusHistory from './pages/AllStatusHistory';

import React from 'react';

// ✅ Wrapper to get location and conditionally show Navbar
const AppLayout = () => {
  const location = useLocation();
  const hideNavbarOnPaths = ['/', '/oauth2/redirect']; // hide navbar on login and redirect
  const shouldShowNavbar = !hideNavbarOnPaths.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
        <Route path="/loan-form" element={<LoanForm />} />
        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="/all-applications" element={<AllApplications />} />
        <Route path="/update-delete" element={<UpdateDeleteLoan />} />
        <Route path="/get-by-email" element={<GetByEmail />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/loan-status-tracker" element={<LoanStatusTracker />} />
        <Route path="/my-loan-history" element={<MyLoanHistory />} />
        <Route path="/all-status-history" element={<AllStatusHistory />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
