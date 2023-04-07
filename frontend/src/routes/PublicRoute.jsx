import React from 'react';

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider.jsx';

import { appRoutes } from './routes.js';

const PublicRoute = () => {
  const { loggedIn } = useAuth();
  return (
    loggedIn
      ? <Navigate to={appRoutes.chatPagePath()} />
      : <Outlet />
  );
};

export default PublicRoute;
