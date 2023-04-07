import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider.jsx';

import { appRoutes } from './routes.js';

const PrivateRoute = () => {
  const { loggedIn } = useAuth();

  return (
    loggedIn
      ? <Outlet />
      : <Navigate to={appRoutes.loginPagePath()} />
  );
};

export default PrivateRoute;
