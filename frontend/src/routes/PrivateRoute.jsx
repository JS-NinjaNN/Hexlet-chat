import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider.jsx';

import routes from './routes.js';

const PrivateRoute = () => {
  const { loggedIn } = useAuth();

  return (
    loggedIn
      ? <Outlet />
      : <Navigate to={routes.appRoutes.loginPagePath()} />
  );
};

export default PrivateRoute;
