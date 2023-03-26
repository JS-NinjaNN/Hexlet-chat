import React, { useRef, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import leoProfanity from 'leo-profanity';
import { Form, Button } from 'react-bootstrap';
import { BsArrowRightSquare } from 'react-icons/bs';

import { useAuth, useSocketApi } from '../../hooks/index.jsx';

const messageFormSchema = yup.object({
  body: yup.string().trim().required(),
});

const MessagesForm = ({ activeChannel }) => {
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
    onSubmit: async (values) => {
      leoProfanity.loadDictionary('ru');
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
    validateOnChange: messageFormSchema,
  });

  return (
    <div className="mt-auto px-5 py-3">
      <Form
        noValidate
        className="py-1 border rounded-2"
        onSubmit={formik.handleSubmit}
      >
        <Form.Group className="input-group">
          <Form.Label visuallyHidden htmlFor="body">Введите сообщение...</Form.Label>
          <Form.Control
            ref={input}
            onChange={formik.handleChange}
            value={formik.values.body}
            onBlur={formik.handleBlur}
            name="body"
            placeholder="Введите сообщение..."
            aria-label="Новое сообщение"
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
            <span className="visually-hidden">Отправить</span>
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
};

export default MessagesForm;
