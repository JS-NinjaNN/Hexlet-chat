import React, { useEffect } from 'react';
import { redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container } from 'react-bootstrap';

import Channels from './chatComponents/Channels.jsx';
import Messages from './chatComponents/Messages.jsx';

import { actions } from '../slices/index.js';
import getAuthHeader from '../getAuthHeader.js';

const ChatPage = () => {
  const dispatch = useDispatch();
  const channels = useSelector((s) => s.channels);
  console.log('initial state: ', channels);

  useEffect(() => {
    const fetchData = async () => {
      const authHeader = await getAuthHeader();
      dispatch(actions.fetchData(authHeader))
        .unwrap()
        .catch((e) => {
          redirect('/login');
        });
    };

    fetchData();
  }, [dispatch]);

  console.log('new state: ', channels);

  if (channels.loading) {
    return <h1>Загрузка...</h1>;
  }

  return (
    <Container className="h-100 my-4 overflow-hidden rounded shadow">
      <div className="row h-100 bg-white flex-md-row">
        <Channels />
        <Messages />
      </div>
    </Container>
  );
};

export default ChatPage;
