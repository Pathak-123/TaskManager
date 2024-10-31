import React from 'react';
import { Navigate,useLocation } from 'react-router-dom';
import PageNotFound from '../Pages/PageNotFound';
const validRoutes = [
  "/dashboard",
  "/analytic",
  "/setting"
];

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const isAuthenticated = !!localStorage.getItem('token');
  const isValidRoute = validRoutes.includes(currentPath);

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  if (!isValidRoute) {
    return <PageNotFound />;
  }

  return <Component {...rest} />;
};

export default ProtectedRoute;