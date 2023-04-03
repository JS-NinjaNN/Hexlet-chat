import React, { useRef, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import leoProfanity from 'leo-profanity';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { BsArrowRightSquare } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';
import { useRollbar } from '@rollbar/react';
import { toast } from 'react-toastify';

import { useAuth } from '../../../contexts/AuthProvider.jsx';
import { useChatApi } from '../../../contexts/ChatApiProvider.jsx';

const validationSchema = yup.object().shape({
  body: yup.string().trim().required(),
});

const MessagesForm = ({ channelId }) => {
  const rollbar = useRollbar();
  const { t } = useTranslation();
  const { getUserName } = useAuth();
  const { sendMessage } = useChatApi();
  const input = useRef(null);

  useEffect(() => {
    input.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      body: '',
    },
    validationSchema,
    validateOnMount: true,
    onSubmit: async ({ body }) => {
      const cleanedMessage = leoProfanity.clean(body);
      const message = {
        body: cleanedMessage,
        username: getUserName(),
        channelId,
      };

      try {
        await sendMessage(message);
        formik.resetForm();
      } catch (error) {
        toast.error(t('noConnection'));
        rollbar.error('MessageForm#sending', error);
      } finally {
        input.current.focus();
      }
    },
  });

  return (
    <Form className="p-3" onSubmit={formik.handleSubmit}>
      <InputGroup>
        <Form.Label visuallyHidden htmlFor="body">{t('messageFormPlaceholder')}</Form.Label>
        <Form.Control
          ref={input}
          onChange={formik.handleChange}
          value={formik.values.body}
          onBlur={formik.handleBlur}
          name="body"
          placeholder={t('messageFormPlaceholder')}
          aria-label={t('newMessage')}
          required
          className="rounded-pill w-100 pe-5 ps-3"
          id="body"
          autoComplete="off"
          disabled={formik.isSubmitting}
        />
        <Button
          disabled={formik.errors.body || formik.isSubmitting}
          className="border-0 rounded-circle p-0 m-1 position-absolute end-0"
          style={{ zIndex: 5 }}
          type="submit"
        >
          <BsArrowRightSquare size="30" />
          <span className="visually-hidden">{t('send')}</span>
        </Button>
      </InputGroup>
    </Form>
  );
};

export default MessagesForm;
