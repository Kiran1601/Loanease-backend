import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token);

      // Decode JWT payload
      const payload = JSON.parse(atob(token.split('.')[1]));

      // Set isAdmin flag based on role in token
      localStorage.setItem('isAdmin', payload.role === 'ADMIN' ? 'true' : 'false');

      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return <p>Redirecting... Please wait.</p>;
};

export default OAuth2RedirectHandler;
