import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { useSocketApi } from '../../hooks/index.jsx';
import { actions } from '../../slices/index.js';

const RemoveChannelModal = ({ onHide, modalInfo }) => {
  const { t } = useTranslation();
  const { id } = modalInfo.channel;
  const socketApi = useSocketApi();
  const dispatch = useDispatch();

  const { currentChannelId } = useSelector((state) => state.channelsInfo);

  const notify = () => toast.success(t('toasts.removeChannel'));

  const handleClose = () => {
    onHide();
    notify();
  };

  const handleSubmit = async () => {
    try {
      await socketApi.removeChannel({ id }, handleClose);
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
        <Modal.Title>{t('modals.removeChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="lead">{t('modals.submitRemove')}</p>
        <div className="d-flex justify-content-end">
          <Button
            variant="secondary"
            type="button"
            onClick={onHide}
            className="me-2"
          >
            {t('modals.cancelButton')}
          </Button>
          <Button
            variant="danger"
            type="button"
            onClick={() => handleSubmit()}
          >
            {t('modals.removeButton')}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default RemoveChannelModal;
