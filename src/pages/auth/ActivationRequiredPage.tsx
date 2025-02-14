import { useNavigate } from 'react-router-dom';
import { useAuth } from './../../components/AuthContext';
import React from 'react';

export const ActivationRequiredPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <section className="section">
      <div className="container is-max-desktop box">
        <h1 className="title has-text-centered">Account Not Activated</h1>
        <p className="has-text-centered">
          Your account has not been activated yet. Please check your email and follow the activation link.
        </p>
        <div className="has-text-centered">
          <a href="/login" onClick={handleLogout} className="button is-primary">
            Go to Login
          </a>
        </div>
      </div>
    </section>
  );
};
