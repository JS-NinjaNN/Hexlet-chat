import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Modal, Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useRollbar } from '@rollbar/react';
import { toast } from 'react-toastify';

import { useChatApi } from '../../../contexts/ChatApiProvider.jsx';
import ChannelName from '../ChannelName.jsx';
import { selectors as modalSelectors } from '../../../slices/modalSlice.js';

const Remove = ({ handleClose }) => {
  const rollbar = useRollbar();
  const { t } = useTranslation();
  const [isSubmitting, setSubmitting] = useState(false);
  const { removeChannel } = useChatApi();

  const { channelId, channelName } = useSelector(modalSelectors.getModalContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await removeChannel(channelId);
      handleClose();
      toast.success(t('toasts.removeChannel'));
    } catch (error) {
      rollbar.error('Remove', error);
      toast.error(t('noConnection'));
      setSubmitting(false);
    }
  };

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.removeChannel')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div>
          <p><b><ChannelName name={channelName} /></b></p>
          <p className="lead">{t('modals.submitRemove')}</p>
        </div>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="d-flex gap-2 col-12 justify-content-end">
            <Button
              variant="outline-primary"
              type="button"
              onClick={handleClose}
              className="col-3"
            >
              {t('modals.cancelButton')}
            </Button>
            <Button
              variant="danger"
              type="submit"
              disabled={isSubmitting}
              className="col-3"
            >
              {t('modals.removeButton')}
            </Button>
          </Form.Group>
        </Form>
      </Modal.Body>
    </>
  );
};

export default Remove;
