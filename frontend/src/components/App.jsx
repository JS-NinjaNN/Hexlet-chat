import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { Navbar, Container, Button } from 'react-bootstrap';

import ChatPage from './ChatPage.jsx';
import LoginPage from './LoginPage.jsx';
import NotFoundPage from './NotFoundPage.jsx';
import SignUpPage from './SignUpPage.jsx';
import { useAuth } from '../hooks/index.jsx';
import routes from '../routes.js';

const PrivateRoute = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();

  return (
    auth.loggedIn ? children : <Navigate to={routes.loginPagePath()} state={{ from: location }} />
  );
};

const AuthButton = () => {
  const auth = useAuth();

  return (
    auth.loggedIn
      ? <Button onClick={auth.logOut}>Выйти</Button>
      : null
  );
};

const App = () => (
  <Router>
    <div className="d-flex flex-column h-100">
      <Navbar bg="white" expand="lg" className="shadow-sm">
        <Container>
          <Navbar.Brand as={Link} to={routes.chatPagePath()}>Hexlet Chat</Navbar.Brand>
          <AuthButton />
        </Container>
      </Navbar>
      <Routes>
        <Route
          path={routes.chatPagePath()}
          element={(
            <PrivateRoute>
              <ChatPage />
            </PrivateRoute>
        )}
        />
        <Route path={routes.loginPagePath()} element={<LoginPage />} />
        <Route path={routes.notFoundPagePath()} element={<NotFoundPage />} />
        <Route path={routes.signupPagePath()} element={<SignUpPage />} />
      </Routes>
    </div>
  </Router>
);

export default App;
