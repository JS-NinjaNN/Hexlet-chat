import React, { useMemo, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { Navbar, Container, Button } from 'react-bootstrap';

import { SocketContext, AuthContext } from '../contexts/index.jsx';
import { actions } from '../slices/index.js';
import ChatPage from './ChatPage.jsx';
import LoginPage from './LoginPage.jsx';
import NotFoundPage from './NotFoundPage.jsx';
import { useAuth } from '../hooks/index.jsx';
import routes from '../routes.js';

const {
  addMessage,
  addChannel,
  setCurrentChannel,
  deleteChannel,
  channelRename,
} = actions;

const AuthProvider = ({ children }) => {
  const savedUserData = JSON.parse(localStorage.getItem('userId'));
  const [loggedIn, setLoggedIn] = useState(Boolean(savedUserData));
  const [user, setUser] = useState(
    savedUserData ? { username: savedUserData.username } : null,
  );

  const logIn = useCallback((userData) => {
    setLoggedIn(true);
    setUser({ username: userData.username });
  }, []);

  const logOut = useCallback(() => {
    localStorage.removeItem('userId');
    setUser(null);
    setLoggedIn(false);
  }, []);

  const memoizedValue = useMemo(
    () => ({
      loggedIn,
      logIn,
      logOut,
      user,
    }),
    [loggedIn, logIn, logOut, user],
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
};

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

const App = () => {
  const socket = io();
  const dispatch = useDispatch();

  socket.on('newMessage', (payload) => {
    dispatch(addMessage(payload));
  });
  socket.on('newChannel', (payload) => {
    dispatch(addChannel(payload));
  });
  socket.on('removeChannel', (payload) => {
    dispatch(deleteChannel(payload.id));
  });
  socket.on('renameChannel', (payload) => {
    dispatch(channelRename(payload));
  });

  const sendMessage = useCallback((...args) => socket.emit('newMessage', ...args), [socket]);

  const newChannel = useCallback((name, cb) => {
    socket.emit('newChannel', { name }, (response) => {
      const { status, data: { id } } = response;

      if (status === 'ok') {
        dispatch(setCurrentChannel({ id }));
        cb();
        return response.data;
      }
      return status;
    });
  }, [dispatch, socket]);

  const removeChannel = useCallback((id) => {
    socket.emit('removeChannel', { id }, (response) => {
      const { status } = response;
      if (status === 'ok') {
        dispatch(removeChannel({ id }));
      }
      return status;
    });
  }, [dispatch, socket]);

  const renameChannel = useCallback(({ name, id }) => socket.emit('renameChannel', { name, id }), [socket]);

  const socketApi = useMemo(
    () => ({
      sendMessage,
      newChannel,
      removeChannel,
      renameChannel,
    }),
    [sendMessage, newChannel, removeChannel, renameChannel],
  );

  return (
    <SocketContext.Provider value={socketApi}>
      <AuthProvider>
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
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </SocketContext.Provider>
  );
};

export default App;
