import { Link } from 'react-router-dom';
import {
  Navbar, Container, Button, NavDropdown, Nav,
} from 'react-bootstrap';

import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthProvider.jsx';
import routes from '../../routes/routes.js';

const LanguageSelector = () => {
  const { t, i18n } = useTranslation();

  const { changeLanguage, resolvedLanguage } = i18n;

  return (
    <NavDropdown title={t('language')}>
      {i18n.languages
        .filter((lng) => lng !== resolvedLanguage)
        .map((lng) => (
          <NavDropdown.Item key={lng} onClick={() => changeLanguage(lng)}>
            {i18n.getFixedT(lng)('language')}
          </NavDropdown.Item>
        ))}
    </NavDropdown>
  );
};

const AuthButton = () => {
  const { t } = useTranslation();
  const { loggedIn, getUserName, logOut } = useAuth();

  if (loggedIn) {
    return (
      <>
        <Navbar.Text className="ms-auto">{getUserName()}</Navbar.Text>
        <Button variant="outline-secondary" size="sm" onClick={logOut}>
          {t('exit')}
        </Button>
      </>
    );
  }

  return null;
};

const NavBar = () => {
  const { t } = useTranslation();

  return (
    <Navbar bg="white" expand="sm" className="border-bottom shadow-sm" variant="light">
      <Container className="p-0 gap-2">
        <Navbar.Brand as={Link} to={routes.chatPagePath()}>
          {t('chatLogo')}
        </Navbar.Brand>
        <Navbar.Collapse id="navbar-settings">
          <Nav className="me-auto">
            <LanguageSelector />
          </Nav>
        </Navbar.Collapse>
        <AuthButton />
        <Navbar.Toggle aria-controls="navbar-settings" />
      </Container>
    </Navbar>
  );
};

export default NavBar;
