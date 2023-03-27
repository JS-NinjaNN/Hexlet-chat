import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Navbar, Container, Button } from 'react-bootstrap';
import { BsGlobe } from 'react-icons/bs';
import { ToastContainer, toast } from 'react-toastify';

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

const AuthButton = ({ translation }) => {
  const auth = useAuth();

  return (
    auth.loggedIn
      ? <Button onClick={auth.logOut}>{translation('exit')}</Button>
      : null
  );
};

const App = () => {
  const [nextLang, setNextLang] = useState('en');
  const { t, i18n } = useTranslation();

  const notify = (lang) => toast.success(`${t('toasts.changeLang')} ${lang}`);

  const handleLangChange = (i18next) => {
    i18next.changeLanguage(nextLang);
    notify(nextLang);
    setNextLang(nextLang === 'ru' ? 'en' : 'ru');
  };

  return (
    <div className="d-flex flex-column h-100">
      <Router>
        <Navbar bg="white" expand="lg" className="shadow-sm">
          <Container>
            <Navbar.Brand as={Link} to={routes.chatPagePath()}>{t('chatLogo')}</Navbar.Brand>
            <Button onClick={() => handleLangChange(i18n)} variant="group-vertical">
              <BsGlobe size="35" />
            </Button>
            <AuthButton translation={t} />
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
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rt1={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Router>
    </div>
  );
};

export default App;
