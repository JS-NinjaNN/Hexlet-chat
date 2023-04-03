import React from 'react';
import { Col } from 'react-bootstrap';

import MessagesHeader from './MessagesHeader.jsx';
import MessagesForm from './MessagesForm.jsx';
import MessagesList from './MessagesList.jsx';

const Messages = ({ channel, messages }) => (
  <Col className="p-0 h-100 d-flex flex-column">
    <MessagesHeader channelName={channel.name} messagesCount={messages.length} />
    <MessagesList channelId={channel.id} content={messages} />
    <MessagesForm channelId={channel.id} />
  </Col>
);

export default Messages;
