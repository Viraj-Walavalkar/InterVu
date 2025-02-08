// UnauthenticatedRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const UnauthenticatedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>; // Optional loading state

  return user ? <Navigate to="/" /> : children;
};

export default UnauthenticatedRoute;
