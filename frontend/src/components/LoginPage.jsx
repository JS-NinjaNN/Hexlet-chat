import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Button, Form, Col, Card, Row,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate } from 'react-router-dom';
import avatarImagePath from '../assets/avatar.jpg';

import { useAuth } from '../hooks/index.jsx';
import routes from '../routes.js';

const LoginPage = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const [authFailed, setAuthFailed] = useState(false);
  const navigate = useNavigate();
  const input = useRef(null);
  useEffect(() => {
    input.current.focus();
  }, []);

  const changeHandler = (e) => {
    e.preventDefault();
    setAuthFailed(false);
  };

  const logInSchema = yup.object().shape({
    username: yup
      .string()
      .trim()
      .required(),
    password: yup
      .string()
      .trim()
      .required(),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: logInSchema,
    onSubmit: async (values) => {
      setAuthFailed(false);

      try {
        const res = await axios.post(routes.loginPath(), values);
        localStorage.setItem('userId', JSON.stringify({ ...res.data }));
        auth.logIn({ username: values.username });
        navigate(routes.chatPagePath());
      } catch (err) {
        formik.setSubmitting(false);
        if (err.isAxiosError && err.response.status === 401) {
          setAuthFailed(true);
          input.current.select();
          return;
        }
        throw err;
      }
    },
  });

  return (
    <div className="container-fluid h-100">
      <Row className="justify-content-center align-content-center h-100">
        <Col className="col-12 col-md-8 col-xxl-6">
          <Card className="shadow-sm">
            <Card.Body className="p-5 row">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <img src={avatarImagePath} alt="LogIn page" className="rounded-circle" />
              </div>
              <Form
                className="col-12 col-md-6 mt-3 mt-mb-0"
                onSubmit={formik.handleSubmit}
              >
                <h1 className="text-center mb-4">{t('enter')}</h1>
                <fieldset disabled={formik.isSubmitting}>
                  <Form.Group className="mb-3 form-floating" controlId="username">
                    <Form.Control
                      type="text"
                      onChange={(e) => {
                        changeHandler(e);
                        formik.handleChange(e);
                      }}
                      value={formik.values.username}
                      onBlur={formik.handleBlur}
                      placeholder={t('username')}
                      autoComplete="username"
                      required
                      ref={input}
                    />
                    <Form.Label>{t('username')}</Form.Label>
                  </Form.Group>

                  <Form.Group className="mb-4 form-floating" controlId="password">
                    <Form.Control
                      type="password"
                      onChange={(e) => {
                        changeHandler(e);
                        formik.handleChange(e);
                      }}
                      value={formik.values.password}
                      onBlur={formik.handleBlur}
                      placeholder={t('password')}
                      autoComplete="current-password"
                      isInvalid={authFailed}
                      required
                    />
                    <Form.Label>{t('password')}</Form.Label>
                    <Form.Control.Feedback type="invalid" className="invalid-feedback" tooltip>{t('invalidData')}</Form.Control.Feedback>
                  </Form.Group>
                  <Button
                    type="submit"
                    variant="outline-primary"
                    className="w-100 mb-3"
                    disabled={formik.errors.username || formik.errors.password}
                  >
                    {t('enter')}
                  </Button>
                </fieldset>
              </Form>
            </Card.Body>
            <Card.Footer className="p-4">
              <div className="text-center">
                <span>{t('noAccount')}</span>
                {' '}
                <NavLink to={routes.signupPagePath()}>{t('signUp')}</NavLink>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LoginPage;
