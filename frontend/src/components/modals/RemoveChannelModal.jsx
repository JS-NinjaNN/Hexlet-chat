import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';

import { useSocketApi } from '../../hooks/index.jsx';
import { actions } from '../../slices/index.js';

const RemoveChannelModal = ({ onHide, modalInfo }) => {
  const { id } = modalInfo.channel;
  const socketApi = useSocketApi();
  const dispatch = useDispatch();

  const { currentChannelId } = useSelector((state) => state.channelsInfo);

  const handleSubmit = async () => {
    try {
      await socketApi.removeChannel({ id }, onHide);
      if (currentChannelId === id) {
        dispatch(actions.setCurrentChannel({ id: 1 }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal show centered onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Удалить канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="lead">Вы уверены?</p>
        <div className="d-flex justify-content-end">
          <Button
            variant="secondary"
            type="button"
            onClick={onHide}
            className="me-2"
          >
            Отменить
          </Button>
          <Button
            variant="danger"
            type="button"
            onClick={() => handleSubmit()}
          >
            Удалить
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default RemoveChannelModal;
