import React from 'react';

const Message = ({ message }) => {
  const {
    id, username, text, time,
  } = message;
  return (
    <div className="d-flex mb-3 justify-content-end" key={id}>
      <div>
        <div className="small text-primary text-end">
          {username}
          {' '}
          <i style={{ opacity: 0.5 }}>{time}</i>
        </div>
        <div className="d-flex justify-content-end">
          <div className="px-3 py-2 text-break text-bg-primary message-corners-end">{text}</div>
        </div>
      </div>
    </div>
  );
};

export default Message;
