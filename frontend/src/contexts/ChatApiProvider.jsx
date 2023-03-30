import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { ChatApiContext } from './index.js';
import { actions } from '../slices/index.js';

const {
  newMessage,
  newChannel,
  removeChannel,
  renameChannel,
} = actions;

const ChatApiProvider = ({ children }) => {
  const dispatch = useDispatch();
  const socket = io();
  socket.on('newMessage', (payload) => {
    dispatch(newMessage(payload));
  });
  socket.on('newChannel', (payload) => {
    dispatch(newChannel(payload));
  });
  socket.on('removeChannel', (payload) => {
    dispatch(removeChannel(payload));
  });
  socket.on('renameChannel', (payload) => {
    dispatch(renameChannel(payload));
  });

  const chatApi = useCallback((action, data, cb = null) => {
    socket.emit(action, data, (response) => {
      if (cb) {
        cb();
      }
      if (response.status !== 'ok') {
        throw new Error('chatApiError');
      }
    });
  }, [socket]);

  return (
    <ChatApiContext.Provider value={chatApi}>
      {children}
    </ChatApiContext.Provider>
  );
};

export default ChatApiProvider;
