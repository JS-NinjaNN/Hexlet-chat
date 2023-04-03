import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import leoProfanity from 'leo-profanity';
import { useTranslation } from 'react-i18next';
import { useRollbar } from '@rollbar/react';
import { Modal, Form, Button } from 'react-bootstrap';
import * as yup from 'yup';
import { toast } from 'react-toastify';

import { useSelector } from 'react-redux';
import { useChatApi } from '../../../contexts/ChatApiProvider.jsx';
import { selectors as channelsSelectors } from '../../../slices/channelsSlice.js';
import { selectors as modalSelectors } from '../../../slices/modalSlice.js';

const Rename = ({ handleClose }) => {
  const rollbar = useRollbar();
  const { t } = useTranslation();
  const { renameChannel } = useChatApi();

  const input = useRef(null);

  useEffect(() => {
    input.current.focus();
    input.current.select();
  }, []);

  const { channelId, channelName } = useSelector(modalSelectors.getModalContext);
  const otherChannelNames = useSelector(channelsSelectors.selectAllChannelsNames)
    .filter((name) => name !== channelName);

  const validationSchema = () => yup.object().shape({
    name: yup
      .string()
      .trim()
      .required(t('required'))
      .min(3, t('nameLength'))
      .max(20, t('nameLength'))
      .notOneOf(otherChannelNames, t('modals.duplicate')),
  });

  const formik = useFormik({
    initialValues: { name: channelName },
    validationSchema,
    onSubmit: async ({ name }) => {
      const cleanedName = leoProfanity.clean(name);
      try {
        await renameChannel(channelId, cleanedName);
        toast.success(t('toasts.renameChannel'));
        handleClose();
      } catch (error) {
        rollbar.error('Rename', error);
        toast.error(t(`toasts.${error.message}`));
      }
    },
    validateOnChange: false,
    validateOnBlur: false,
  });

  const nameIsInvalid = formik.errors.name && formik.touched.name;

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.renameChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              ref={input}
              id="name"
              name="name"
              required
              onChange={formik.handleChange}
              value={formik.values.name}
              isInvalid={nameIsInvalid}
              disabled={formik.isSubmitting}
            />
            <Form.Label htmlFor="name" visuallyHidden>{t('modals.channelName')}</Form.Label>
            <Form.Control.Feedback type="invalid">
              {formik.errors.name}
            </Form.Control.Feedback>
            <Modal.Footer className="d-flex gap-2 col-12 justify-content-end">
              <Button
                variant="outline-primary"
                type="button"
                onClick={handleClose}
                className="col-3"
              >
                {t('modals.cancelButton')}
              </Button>
              <Button
                variant="primary"
                type="submit"
                onClick={formik.handleSubmit}
                disabled={formik.errors.name || formik.isSubmitting}
                className="col-3"
              >
                {t('modals.rename')}
              </Button>
            </Modal.Footer>
          </Form.Group>
        </Form>
      </Modal.Body>
    </>
  );
};

export default Rename;
