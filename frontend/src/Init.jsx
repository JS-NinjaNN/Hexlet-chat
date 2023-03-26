import React, { useMemo, useState, useCallback } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { configureStore } from '@reduxjs/toolkit';
import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import leoProfanity from 'leo-profanity';

import App from './components/App.jsx';
import resources from './locales/index.js';
import reducer, { actions } from './slices/index.js';
import { SocketContext, AuthContext } from './contexts/index.jsx';

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

const Init = async () => {
  const i18n = i18next.createInstance();

  await i18n
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'ru',
    });

  const ruDict = leoProfanity.getDictionary('ru');
  const enDict = leoProfanity.getDictionary('en');
  leoProfanity.add(ruDict, enDict);

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

  const removeChannel = useCallback((id, cb) => {
    socket.emit('removeChannel', id, (response) => {
      const { status } = response;
      if (status === 'ok') {
        dispatch(deleteChannel(id));
        cb();
      }
      return status;
    });
  }, [dispatch, socket]);

  const renameChannel = useCallback(({ id, name }, cb) => {
    socket.emit('renameChannel', { id, name }, (response) => {
      const { status } = response;
      if (status === 'ok') {
        dispatch(channelRename({ id, name }));
        cb();
      }
      return status;
    });
  }, [dispatch, socket]);

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
    <I18nextProvider i18n={i18n}>
      <SocketContext.Provider value={socketApi}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </SocketContext.Provider>
    </I18nextProvider>
  );
};

const InitWrapper = () => {
  const store = configureStore({
    reducer,
  });

  return (
    <Provider store={store}>
      <Init />
    </Provider>
  );
};

export default InitWrapper;
