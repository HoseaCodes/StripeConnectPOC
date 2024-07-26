import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useLocation } from 'react-router-dom';
import api from '../utils/api'; // Assuming you have a utility for making API requests

const RefreshRedirect = () => {
  const location = useLocation();
    const navigate = useNavigate();


  useEffect(() => {
    const fetchAndRedirect = async () => {
      const params = new URLSearchParams(location.search);
      const accountId = params.get('account_id');

      if (accountId) {
        try {
          // Make a request to your server to get a new account link
          const response = await api.get(`/refresh?account_id=${accountId}`);

          if (response.status === 200) {
            // Redirect the user to the new account link
            window.location.href = response.data.url;
          } else {
            // Handle error if refresh link cannot be generated
            navigate('/error?message=Unable to refresh account link. Please try again later.');
          }
        } catch (error) {
          console.error('Error fetching new account link:', error);
          navigate('/error?message=Unable to refresh account link. Please try again later.');
        }
      } else {
        navigate('/error?message=Account ID is missing');
      }
    };

    fetchAndRedirect();
  }, [location.search, navigate]);

  return (
    <div>
      <p>Redirecting...</p>
    </div>
  );
};

export default RefreshRedirect;
