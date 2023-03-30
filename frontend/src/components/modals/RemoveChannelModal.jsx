import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { useChatApi } from '../../hooks/index.jsx';

const RemoveChannelModal = ({ onHide, modalInfo }) => {
  const { t } = useTranslation();
  const { id } = modalInfo.channel;
  const chatApi = useChatApi();

  const notify = () => toast.success(t('toasts.removeChannel'));
  const notifyError = (text) => toast.error(t(`toasts.${text}`));

  const handleClose = () => {
    onHide();
    notify();
  };

  const handleSubmit = () => {
    try {
      chatApi('removeChannel', { id }, handleClose);
    } catch (error) {
      notifyError(error.message);
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
