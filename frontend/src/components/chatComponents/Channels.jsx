import React, { useEffect } from 'react';
import { BsPlusSquare } from 'react-icons/bs';
import { Nav } from 'react-bootstrap';

const Channels = () => {
  const a = 'asd';
  return (
    <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <b>Каналы</b>
        <button type="button" className="p-0 text-primary btn btn-group-vertical">
          <BsPlusSquare size="20" />
          <span className="visually-hidden">+</span>
        </button>
      </div>
      <Nav
        as="ul"
        className="flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block"
        id="channels-box"
      >
        {a}
      </Nav>
    </div>
  );
};

export default Channels;
