import { Col } from 'react-bootstrap';

import MessagesHeader from './MessagesHeader.jsx';

const Messages = () => {
  const a = 'asd';
  return (
    <Col className="p-0 h-100">
      <div className="d-flex flex-column h-100">
        <MessagesHeader />
        {a}
      </div>
    </Col>
  );
};

export default Messages;
