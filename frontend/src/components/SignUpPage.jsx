import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import {
  Button, Form, Col, Card, Row,
} from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import avatarImagePath from '../assets/avatar_1.jpg';
import { useAuth } from '../hooks/index.jsx';
import routes from '../routes.js';

const SignUpPage = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const [authFailed, setAuthFailed] = useState(false);
  const navigate = useNavigate();
  const input = useRef(null);
  useEffect(() => {
    input.current.focus();
    input.current.select();
  }, [authFailed]);

  const signUpSchema = yup.object().shape({
    username: yup
      .string()
      .trim()
      .min(3, t('nameLength'))
      .max(20, t('nameLength'))
      .required(t('required')),
    password: yup
      .string()
      .trim()
      .min(6, t('signUpPage.minPasswordLength'))
      .required(t('required')),
    passwordConfirmation: yup
      .string()
      .trim()
      .required(t('required'))
      .oneOf(
        [yup.ref('password'), null],
        t('signUpPage.invalidPasswordConfirmation'),
      ),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      passwordConfirmation: '',
    },
    validationSchema: signUpSchema,
    onSubmit: async (values) => {
      setAuthFailed(false);

      try {
        const res = await axios.post(routes.signupPath(), {
          username: values.username, password: values.password,
        });
        localStorage.setItem('userId', JSON.stringify({ ...res.data }));
        auth.logIn({ username: values.username });
        navigate(routes.chatPagePath());
      } catch (err) {
        formik.setSubmitting(false);
        if (err.isAxiosError && err.response.status === 409) {
          setAuthFailed(true);
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
            <Card.Body className="d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
              <div>
                <img src={avatarImagePath} alt="signUp page" className="rounded-circle" />
              </div>
              <Form
                className="w-50"
                onSubmit={formik.handleSubmit}
              >
                <h1 className="text-center mb-4">{t('signUp')}</h1>
                <fieldset disabled={formik.isSubmitting}>
                  <Form.Group className="mb-3 form-floating" controlId="username">
                    <Form.Control
                      type="text"
                      onChange={formik.handleChange}
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
                    disabled={
                      formik.errors.username
                      || formik.errors.password
                      || formik.errors.passwordConfirmation
                    }
                  >
                    {t('signUpPage.signUp')}
                  </Button>
                </fieldset>
              </Form>
            </Card.Body>
            <Card.Footer className="p-4">
              <div className="text-center">
                <span>{t('signUpPage.signedUp')}</span>
                {' '}
                <NavLink to={routes.loginPagePath()}>{t('enter')}</NavLink>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SignUpPage;
