import React from 'react';

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/index.jsx';

import routes from './routes.js';

const PublicRoute = () => {
  const auth = useAuth();
  return (
    auth.loggedIn
      ? <Navigate to={routes.chatPagePath()} />
      : <Outlet />
  );
};

export default PublicRoute;
