import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { useRollbar } from '@rollbar/react';
import leoProfanity from 'leo-profanity';
import { useTranslation } from 'react-i18next';
import {
  Modal, Form, Button,
} from 'react-bootstrap';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useChatApi } from '../../../contexts/ChatApiProvider.jsx';
import { selectors as channelSelectors } from '../../../slices/channelsSlice.js';

const Add = ({ handleClose }) => {
  const rollbar = useRollbar();
  const { t } = useTranslation();
  const { createChannel } = useChatApi();

  const existingChannelsNames = useSelector(channelSelectors.selectAllChannelsNames);

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .trim()
      .required(t('required'))
      .min(3, t('nameLength'))
      .max(20, t('nameLength'))
      .notOneOf(existingChannelsNames, t('modals.duplicate')),
  });

  const input = useRef(null);

  useEffect(() => {
    input.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: { name: '' },
    validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async ({ name }) => {
      const cleanedName = leoProfanity.clean(name);
      try {
        await createChannel(cleanedName);
        handleClose();
        toast.success(t('toasts.createChannel'));
      } catch (error) {
        rollbar.error('Add', error);
        toast.error(t('noConnection'));
      }
    },
  });

  const isNameInvalid = formik.errors.name && formik.touched.name;

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.addChannel')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={formik.handleSubmit} autoComplete="off">
          <Form.Group className="mb-3" controlId="name">
            <Form.Control
              ref={input}
              name="name"
              required
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              isInvalid={isNameInvalid}
              disabled={formik.isSubmitting}
            />
            <Form.Label visuallyHidden>{t('modals.channelName')}</Form.Label>
            <Form.Control.Feedback type="invalid">
              {formik.errors.name && formik.errors.name}
            </Form.Control.Feedback>
            <Modal.Footer>
              <Button
                variant="outline-primary"
                type="button"
                onClick={handleClose}
              >
                {t('modals.cancelButton')}
              </Button>
              <Button
                variant="primary"
                type="submit"
                onClick={formik.handleSubmit}
                disabled={formik.isSubmitting}
              >
                {t('modals.sendButton')}
              </Button>
            </Modal.Footer>
          </Form.Group>
        </Form>
      </Modal.Body>
    </>
  );
};

export default Add;
