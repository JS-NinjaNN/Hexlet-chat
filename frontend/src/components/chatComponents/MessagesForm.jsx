import React, { useRef, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import leoProfanity from 'leo-profanity';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { BsArrowRightSquare } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';

import { useAuth, useSocketApi } from '../../hooks/index.jsx';

const messageFormSchema = yup.object().shape({
  body: yup.string().required(),
});

const MessagesForm = ({ activeChannel }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const socketApi = useSocketApi();
  const input = useRef(null);

  useEffect(() => {
    input.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      body: '',
    },
    validationSchema: messageFormSchema,
    onSubmit: async (values) => {
      const cleanedMessage = leoProfanity.clean(values.body);
      const message = {
        text: cleanedMessage,
        channelId: activeChannel.id,
        username: user.username,
      };

      try {
        await socketApi.sendMessage(message);
        formik.values.body = '';
      } catch (error) {
        console.error(error.message);
      }
      input.current.focus();
    },
  });

  return (
    <div className="mt-auto px-5 py-3">
      <Form
        className="py-1 border rounded-2"
        onSubmit={formik.handleSubmit}
      >
        <InputGroup hasValidation>
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
            className="border-0 p-0 ps-2"
            id="body"
          />
          <Button
            variant="group-vertical"
            disabled={formik.errors.body}
            style={{ border: 'none' }}
            type="submit"
          >
            <BsArrowRightSquare size="20" />
            <span className="visually-hidden">{t('send')}</span>
          </Button>
        </InputGroup>
      </Form>
    </div>
  );
};

export default MessagesForm;
