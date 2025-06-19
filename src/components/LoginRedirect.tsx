import React, { useEffect } from 'react';
import LoginForm from './LoginForm';

const LoginRedirect: React.FC = () => {
  useEffect(() => {
    // Check if this is a token-based redirect first
    const token = new URLSearchParams(window.location.search).get('token');
    
    if (token) {
      // Store token in localStorage
      localStorage.setItem('gametriq_token', token);
      // Wait briefly, then redirect to app using vanilla JavaScript
      setTimeout(() => {
        window.location.href = '/app';
      }, 100);
      return;
    }
    
    // If no token, this is just a regular login page visit
    // The LoginForm component will handle the rest
  }, []);

  // Check if there's a token in the URL - if so, don't render the form
  const token = new URLSearchParams(window.location.search).get('token');
  if (token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">Redirecting...</div>
      </div>
    );
  }

  // Otherwise show the login form
  return <LoginForm />;
};

export default LoginRedirect;
