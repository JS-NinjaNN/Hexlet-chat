import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import { useRollbar } from '@rollbar/react';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import {
  Button, Form, Col, Card, Row, Container, Image,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import avatarImagePath from '../../assets/avatar.jpg';

import { useAuth } from '../../contexts/AuthProvider.jsx';
import { appRoutes } from '../../routes/routes.js';

const LoginPage = () => {
  const rollbar = useRollbar();
  const { t } = useTranslation();
  const auth = useAuth();
  const [authFailed, setAuthFailed] = useState(false);
  const input = useRef(null);

  useEffect(() => {
    input.current.focus();
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    setAuthFailed(false);
  };

  const validationSchema = yup.object().shape({
    username: yup.string().trim().required(t('required')),
    password: yup.string().trim().required(t('required')),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setAuthFailed(false);
      try {
        await auth.logIn(values);
      } catch (error) {
        formik.setSubmitting(false);
        if (error.isAxiosError && error.response.status === 401) {
          setAuthFailed(true);
          input.current.select();
          return;
        }
        toast.error(t('noConnection'));
        rollbar.error('LogIn', error);
      }
    },
  });

  const isUsernameInvalid = formik.errors.username && formik.touched.username;
  const isPasswordInvalid = formik.errors.password && formik.touched.password;

  return (
    <Container fluid className="h-100">
      <Row className="justify-content-center align-items-center h-100">
        <Col xs={12} md={8} xxl={6}>
          <Card className="shadow-sm">
            <Card.Body className="p-5 row">
              <Col xs={12} md={6} className="d-flex align-items-center justify-content-center">
                <Image src={avatarImagePath} roundedCircle alt={t('enter')} />
              </Col>
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
                        handleChange(e);
                        formik.handleChange(e);
                      }}
                      value={formik.values.username}
                      onBlur={formik.handleBlur}
                      placeholder={t('yourNickname')}
                      autoComplete="username"
                      required
                      ref={input}
                      isInvalid={authFailed || isUsernameInvalid}
                    />
                    <Form.Label>{t('yourNickname')}</Form.Label>
                    <Form.Control.Feedback type="invalid" className="invalid-feedback" tooltip={isUsernameInvalid}>
                      {formik.errors.username}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-4 form-floating" controlId="password">
                    <Form.Control
                      type="password"
                      onChange={(e) => {
                        handleChange(e);
                        formik.handleChange(e);
                      }}
                      value={formik.values.password}
                      onBlur={formik.handleBlur}
                      placeholder={t('password')}
                      autoComplete="current-password"
                      isInvalid={authFailed || isPasswordInvalid}
                      required
                    />
                    <Form.Label>{t('password')}</Form.Label>
                    <Form.Control.Feedback type="invalid" className="invalid-feedback" tooltip>
                      {formik.errors.password || t('invalidData')}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Button
                    type="submit"
                    variant="outline-primary"
                    className="w-100 mb-3"
                  >
                    {t('enter')}
                  </Button>
                </fieldset>
              </Form>
            </Card.Body>
            <Card.Footer className="p-4">
              <div className="text-center text-muted">
                <span>{t('noAccount')}</span>
                {' '}
                <NavLink to={appRoutes.signupPagePath()}>{t('signUp')}</NavLink>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
