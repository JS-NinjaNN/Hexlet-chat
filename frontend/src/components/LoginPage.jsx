/* eslint-disable no-unused-vars */
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import {
  Button, Form, Col, Card, Row, FloatingLabel,
} from 'react-bootstrap';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import avatarImagePath from '../assets/avatar.jpeg';
import useAuth from '../hooks';

const LoginPage = () => {
  const auth = useAuth();
  const [authFailed, setAuthFailed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async (values) => {
      setAuthFailed(false);
    },
  });

  return (
    <Row className="justify-content-center align-content-center h-100">
      <Col className="col-12 col-md-8 col-xxl-6">
        <Card className="shadow-sm">
          <Card.Body className="p-5 row">
            <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
              <img src={avatarImagePath} alt="Log in page" className="roundedCircle" />
            </div>
            <Form className="col-12 col-md-6 mt-3 mt-mb-0" onSubmit={formik.handleSubmit}>
              <h1 className="text-center mb-4">Войти</h1>
              <fieldset disabled={formik.isSubmitting}>
                <Form.Group className="form-floating mb-3">
                  <FloatingLabel controlId="floatingUsername" label="Ваш ник">
                    <Form.Control
                      type="text"
                      onChange={formik.handleChange}
                      value={formik.values.username}
                      onBlur={formik.handleBlur}
                      placeholder="username"
                      id="username"
                      autoComplete="username"
                      isInvalid={authFailed}
                      requered
                    // ref={ }
                    />
                  </FloatingLabel>
                </Form.Group>
                <Form.Group className="form-floating mb-3">
                  <FloatingLabel controlId="floatingPassword" label="Пароль">
                    <Form.Control
                      type="password"
                      onChange={formik.handleChange}
                      value={formik.values.password}
                      onBlur={formik.handleBlur}
                      placeholder="password"
                      id="password"
                      autoComplete="current-password"
                      isInvalid={authFailed}
                      requered
                    />
                  </FloatingLabel>
                  <Form.Control.Feedback type="invalid" className="invalid-feedback">Неверные имя пользователя или пароль</Form.Control.Feedback>
                </Form.Group>
                <Button type="submit" variant="outline-primary" className="w-100 mb-3">Войти</Button>
              </fieldset>
            </Form>
          </Card.Body>
          <Card.Footer className="p-4">
            <div className="text-center">
              <span>Нет аккаунта?</span>
              {' '}
              <NavLink to="/login">Регистрация</NavLink>
            </div>
          </Card.Footer>
        </Card>
      </Col>
    </Row>
  );
};

export default LoginPage;
