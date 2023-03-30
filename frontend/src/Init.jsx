import React from 'react';
import { Provider } from 'react-redux';
import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import leoProfanity from 'leo-profanity';

import App from './components/App.jsx';
import resources from './locales/index.js';
import store from './slices/index.js';
import ChatApiProvider from './contexts/ChatApiProvider.jsx';
import AuthProvider from './contexts/AuthProvider.jsx';

const Init = async () => {
  const i18n = i18next.createInstance();
  await i18n
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'ru',
    });

  leoProfanity
    .add(leoProfanity.getDictionary('ru'), leoProfanity.getDictionary('en'));

  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <ChatApiProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ChatApiProvider>
      </I18nextProvider>
    </Provider>
  );
};

export default Init;
