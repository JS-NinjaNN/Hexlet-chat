import React from 'react';
import { useSelector } from 'react-redux';
import { Col } from 'react-bootstrap';

import MessagesHeader from './MessagesHeader.jsx';
import MessagesForm from './MessagesForm.jsx';
import Message from './Message.jsx';

const Messages = () => {
  const { channels, currentChannelId } = useSelector((s) => s.channelsInfo);
  const messages = useSelector((s) => s.messagesInfo.messages);

  const activeChannel = channels
    .find(({ id }) => id === currentChannelId);

  const activeChannelMessages = messages
    .filter((message) => message.channelId === currentChannelId);

  return (
    <Col className="p-0 h-100">
      <div className="d-flex flex-column h-100">
        <MessagesHeader
          activeChannel={activeChannel}
          messagesCount={activeChannelMessages.length}
        />
        <div className="chat-messages overflow-auto px-5" id="messages-box">
          {activeChannelMessages.map((message) => (
            <Message message={message} key={message.id} />
          ))}
        </div>
        <MessagesForm activeChannel={activeChannel} />
      </div>
    </Col>
  );
};

export default Messages;
