import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Navbar, Container, Button } from 'react-bootstrap';
import { BsGlobe } from 'react-icons/bs';
import { ToastContainer, toast } from 'react-toastify';
import { Provider, ErrorBoundary } from '@rollbar/react';

import ChatPage from './ChatPage.jsx';
import LoginPage from './LoginPage.jsx';
import NotFoundPage from './NotFoundPage.jsx';
import SignUpPage from './SignUpPage.jsx';

import PrivateRoute from '../routes/PrivateRoute.jsx';
import PublicRoute from '../routes/PublicRoute.jsx';

import { useAuth } from '../hooks/index.jsx';
import routes from '../routes/routes.js';

const rollbarConfig = {
  accessToken: process.env.REACT_APP_ROLLBAR_TOKEN,
  payload: {
    environment: 'production',
  },
  captureUncaught: true,
  captureUnhandledRejections: true,
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
    <Provider config={rollbarConfig}>
      <ErrorBoundary>
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
              <Route element={<PrivateRoute />}>
                <Route path={routes.chatPagePath()} element={<ChatPage />} />
              </Route>
              <Route element={<PublicRoute />}>
                <Route path={routes.loginPagePath()} element={<LoginPage />} />
                <Route path={routes.signupPagePath()} element={<SignUpPage />} />
              </Route>
              <Route path={routes.notFoundPagePath()} element={<NotFoundPage />} />
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
      </ErrorBoundary>
    </Provider>
  );
};

export default App;
