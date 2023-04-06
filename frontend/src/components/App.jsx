import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import { ToastContainer, Slide } from 'react-toastify';

import ChatPage from './Chat/ChatPage.jsx';
import LoginPage from './LogIn/LoginPage.jsx';
import NotFoundPage from './Errors/NotFoundPage.jsx';
import SignUpPage from './SignUp/SignUpPage.jsx';
import NavBar from './common/NavBar.jsx';

import PrivateRoute from '../routes/PrivateRoute.jsx';
import PublicRoute from '../routes/PublicRoute.jsx';
import routes from '../routes/routes.js';

const App = () => (
  <Router>
    <div className="d-flex flex-column h-100">
      <NavBar />
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path={routes.appRoutes.chatPagePath()} element={<ChatPage />} />
        </Route>
        <Route element={<PublicRoute />}>
          <Route path={routes.appRoutes.loginPagePath()} element={<LoginPage />} />
          <Route path={routes.appRoutes.signupPagePath()} element={<SignUpPage />} />
        </Route>
        <Route path={routes.appRoutes.notFoundPagePath()} element={<NotFoundPage />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rt1={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Slide}
      />
    </div>
  </Router>
);

export default App;
