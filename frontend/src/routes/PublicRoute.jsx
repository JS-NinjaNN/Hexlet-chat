import React from 'react';

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider.jsx';

import routes from './routes.js';

const PublicRoute = () => {
  const { loggedIn } = useAuth();
  return (
    loggedIn
      ? <Navigate to={routes.appRoutes.chatPagePath()} />
      : <Outlet />
  );
};

export default PublicRoute;
