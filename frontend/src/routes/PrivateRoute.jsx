import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/index.jsx';

import routes from './routes.js';

const PrivateRoute = () => {
  const auth = useAuth();

  return (
    auth.loggedIn
      ? <Outlet />
      : <Navigate to={routes.loginPagePath()} />
  );
};

export default PrivateRoute;
