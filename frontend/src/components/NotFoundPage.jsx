import { useTranslation } from 'react-i18next';

import notFoundImagePath from '../assets/notFound.jpg';
import routes from '../routes/routes.js';

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center">
      <img src={notFoundImagePath} alt={t('pageNotFound')} className="img-fluid h-25" />
      <h1 className="h4 text-muted">{t('pageNotFound')}</h1>
      <p className="text-muted">
        {t('youCanGo')}
        {' '}
        <a href={routes.chatPagePath()}>{t('homePage')}</a>
      </p>
    </div>
  );
};

export default NotFoundPage;
