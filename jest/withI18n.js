import React from 'react';
import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from "react-i18next";
import { availableLanguages } from '../src/apis/getAvailableLanguages';

i18next.languages = availableLanguages;

const resources = i18next.languages.reduce((accumulator, language,) => {
  const translation = require(`../i18n/translation-${language}.json`);
  accumulator[language] = {
    translation
  };
  return accumulator;
}, {});

const options = {
  fallbackLng: 'en',
  react: {
    useSuspense: false,
  },
  resources
};
i18next
  .use(initReactI18next)
  .init(options);

export default function withI18n(Component) {
  return function WithI18nWrapper(props) {
    return (
      <I18nextProvider i18n={i18next}>
        <Component {...props} />
      </I18nextProvider>
    );
  };
}
