import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import leoProfanity from 'leo-profanity';
import { useTranslation } from 'react-i18next';
import {
  Modal, Form, Button, FormControl,
} from 'react-bootstrap';
import * as yup from 'yup';
import { toast } from 'react-toastify';

import { useSelector } from 'react-redux';
import { useSocketApi } from '../../hooks/index.jsx';

const channelsValidationSchema = (channelsNames, translate) => yup.object().shape({
  name: yup
    .string()
    .trim()
    .required(translate('required'))
    .min(3, translate('nameLength'))
    .max(20, translate('nameLength'))
    .notOneOf(channelsNames, translate('modals.duplicate')),
});

const RenameChannelModal = ({ onHide, modalInfo }) => {
  const { t } = useTranslation();
  const channels = useSelector((s) => s.channelsInfo.channels);
  const channelsNames = channels.map((channel) => channel.name);
  const currentChannel = modalInfo.channel;
  const socketApi = useSocketApi();

  const input = useRef(null);

  useEffect(() => {
    input.current.focus();
    input.current.select();
  }, []);

  const notify = () => toast.success(t('toasts.renameChannel'));

  const handleClose = () => {
    onHide();
    notify();
  };

  const formik = useFormik({
    initialValues: {
      name: currentChannel.name,
    },
    validationSchema: channelsValidationSchema(channelsNames, t),
    onSubmit: async (values) => {
      const cleanedName = leoProfanity.clean(values.name);
      try {
        await socketApi.renameChannel({ name: cleanedName, id: currentChannel.id }, handleClose);
        formik.values.name = '';
      } catch (error) {
        console.error(error.message);
      }
    },
  });

  return (
    <Modal show centered onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.renameChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group>
            <Form.Control
              className="mb-2"
              ref={input}
              id="name"
              name="name"
              required
              onChange={formik.handleChange}
              value={formik.values.name}
              isInvalid={!!formik.errors.name}
            />
            <Form.Label htmlFor="name" visuallyHidden>{t('modals.channelName')}</Form.Label>
            <FormControl.Feedback type="invalid">
              {formik.errors.name}
            </FormControl.Feedback>
            <Modal.Footer>
              <Button
                variant="secondary"
                type="button"
                onClick={onHide}
              >
                {t('modals.cancelButton')}
              </Button>
              <Button
                variant="primary"
                type="submit"
                onClick={formik.handleSubmit}
                disabled={formik.errors.name}
              >
                {t('modals.rename')}
              </Button>
            </Modal.Footer>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RenameChannelModal;
