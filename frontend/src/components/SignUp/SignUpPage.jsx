import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useRollbar } from '@rollbar/react';
import { toast } from 'react-toastify';
import {
  Button, Form, Col, Card, Row, Container, Image,
} from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthProvider.jsx';
import routes from '../../routes/routes.js';
import avatarImagePath from '../../assets/avatar_1.jpg';

const SignUpPage = () => {
  const rollbar = useRollbar();
  const { t } = useTranslation();
  const auth = useAuth();
  const [authFailed, setAuthFailed] = useState(false);
  const input = useRef(null);
  useEffect(() => {
    input.current.focus();
    input.current.select();
  }, [authFailed]);

  const validationSchema = yup.object().shape({
    username: yup
      .string()
      .trim()
      .min(3, t('nameLength'))
      .max(20, t('nameLength'))
      .typeError(t('required'))
      .required(t('required')),
    password: yup
      .string()
      .trim()
      .min(6, t('signUpPage.minPasswordLength'))
      .typeError(t('required'))
      .required(t('required')),
    passwordConfirmation: yup
      .string()
      .test(
        'passwordConfirmation',
        t('signUpPage.invalidPasswordConfirmation'),
        (password, context) => password === context.parent.password,
      ),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      passwordConfirmation: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setAuthFailed(false);

      try {
        await auth.signUp(values);
      } catch (error) {
        formik.setSubmitting(false);
        if (error.isAxiosError && error.response.status === 409) {
          setAuthFailed(true);
          return;
        }
        toast.error(t('noConnection'));
        rollbar.error('SignUp', error);
      }
    },
  });

  return (
    <Container fluid className="h-100">
      <Row className="justify-content-center align-items-center h-100">
        <Col xs={12} md={8} xxl={6}>
          <Card className="shadow-sm">
            <Card.Body className="d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
              <Col xs={12} md={6} className="d-flex align-items-center justify-content-center">
                <Image src={avatarImagePath} roundedCircle alt={t('signUp')} />
              </Col>
              <Form
                className="w-50"
                onSubmit={formik.handleSubmit}
              >
                <h1 className="text-center mb-4">{t('signUp')}</h1>
                <fieldset disabled={formik.isSubmitting}>
                  <Form.Group className="mb-3 form-floating" controlId="username">
                    <Form.Control
                      type="text"
                      onChange={(e) => {
                        setAuthFailed(false);
                        formik.handleChange(e);
                      }}
                      value={formik.values.username}
                      onBlur={formik.handleBlur}
                      placeholder={t('username')}
                      autoComplete="username"
                      isInvalid={(formik.touched.username && formik.errors.username) || authFailed}
                      isValid={formik.touched.username && !formik.errors.username && !authFailed}
                      required
                      ref={input}
                    />
                    <Form.Label>{t('username')}</Form.Label>
                    <Form.Control.Feedback type="invalid" className="invalid-feedback" tooltip>
                      {
                        formik.errors.username ? formik.errors.username : t('signUpPage.existingUser')
                      }
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3 form-floating" controlId="password">
                    <Form.Control
                      type="password"
                      onChange={formik.handleChange}
                      value={formik.values.password}
                      onBlur={formik.handleBlur}
                      placeholder={t('password')}
                      autoComplete="current-password"
                      isInvalid={formik.touched.password && formik.errors.password}
                      isValid={formik.touched.password && !formik.errors.password}
                      required
                    />
                    <Form.Label>{t('password')}</Form.Label>
                    <Form.Control.Feedback type="invalid" className="invalid-feedback" tooltip>{formik.errors.password}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-4 form-floating" controlId="passwordConfirmation">
                    <Form.Control
                      type="password"
                      onChange={formik.handleChange}
                      value={formik.values.passwordConfirmation}
                      onBlur={formik.handleBlur}
                      placeholder={t('signUpPage.passwordConfirmation')}
                      autoComplete="passwordConfirmation"
                      isInvalid={
                        formik.touched.passwordConfirmation && formik.errors.passwordConfirmation
                      }
                      isValid={
                        formik.touched.passwordConfirmation && !formik.errors.passwordConfirmation
                      }
                      required
                    />
                    <Form.Label>{t('signUpPage.passwordConfirmation')}</Form.Label>
                    <Form.Control.Feedback type="invalid" className="invalid-feedback" tooltip>{formik.errors.passwordConfirmation}</Form.Control.Feedback>
                  </Form.Group>
                  <Button
                    type="submit"
                    variant="outline-primary"
                    className="w-100 mb-3"
                  >
                    {t('signUpPage.signUp')}
                  </Button>
                </fieldset>
              </Form>
            </Card.Body>
            <Card.Footer className="p-4">
              <div className="text-muted text-center">
                <span>{t('signUpPage.signedUp')}</span>
                {' '}
                <NavLink to={routes.loginPagePath()}>{t('enter')}</NavLink>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SignUpPage;
