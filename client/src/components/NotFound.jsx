import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-dark text-white">
      <FaExclamationTriangle className="text-warning mb-4" size={80} />
      <h1 className="display-1 fw-bold text-white mb-2">404</h1>
      <h2 className="mb-4">Page Not Found</h2>
      <p className="text-white-50 mb-5 text-center" style={{ maxWidth: '400px' }}>
        Oops! The page you are looking for does not exist. It might have been moved or deleted.
      </p>
      <Link to="/" className="btn btn-outline-warning px-4 py-2 rounded-pill fw-bold">
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
