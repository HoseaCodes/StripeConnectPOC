import React from 'react';
import { useLocation } from 'react-router-dom';

const ErrorPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const message = query.get('message') || 'An unexpected error occurred.';

  return (
    <div>
      <h1>Error</h1>
      <p>{message}</p>
    </div>
  );
};

export default ErrorPage;
