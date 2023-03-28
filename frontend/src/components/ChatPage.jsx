import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import Channels from './chatComponents/Channels.jsx';
import Messages from './chatComponents/Messages.jsx';

import { actions } from '../slices/index.js';
import getAuthHeader from '../getAuthHeader.js';
import { useAuth } from '../hooks/index.jsx';

const ChatPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const auth = useAuth();
  const channelsInfo = useSelector((s) => s);

  useEffect(() => {
    const notify = () => toast.error(t('toasts.fetchDataError'));
    const fetchData = async () => {
      const authHeader = await getAuthHeader();
      dispatch(actions.fetchData(authHeader))
        .unwrap()
        .catch((error) => {
          notify();
          auth.logOut();
          console.error(error);
        });
    };

    fetchData();
  }, [dispatch, t, auth]);

  if (channelsInfo.loading) {
    return (
      <Container className="h-100 my-4 overflow-hidden rounded shadow">
        <div className="row h-100 bg-white flex-md-row">
          <h1>{t('loading')}</h1>
        </div>
      </Container>
    );
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
