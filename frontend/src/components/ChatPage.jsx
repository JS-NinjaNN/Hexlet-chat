import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Rings } from 'react-loader-spinner';

import Channels from './chatComponents/Channels.jsx';
import Messages from './chatComponents/Messages.jsx';

import { actions } from '../slices/index.js';
import { useAuth } from '../hooks/index.jsx';

const ChatPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const auth = useAuth();
  const channelsInfo = useSelector((s) => s.channelsInfo);

  useEffect(() => {
    const notify = () => toast.error(t('toasts.fetchDataError'));
    const fetchData = () => {
      dispatch(actions.fetchData(auth.getAuthHeader()))
        .unwrap()
        .catch(() => {
          notify();
          auth.logOut();
        });
    };

    fetchData();
  }, [dispatch, t, auth]);

  return (
    <Container className="h-100 my-4 overflow-hidden rounded shadow">
      <div className="row h-100 bg-white flex-md-row">
        {
          channelsInfo.loading
            ? (
              <Rings
                height="200"
                width="200"
                color="#4fa94d"
                radius="6"
                visible
                ariaLabel="rings-loading"
                wrapperClass="justify-content-center align-items-center"
              />
            )
            : (
              <>
                <Channels />
                <Messages />
              </>
            )
        }
      </div>
    </Container>
  );
};

export default ChatPage;
