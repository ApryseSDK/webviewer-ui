import React from 'react';
import i18next from 'i18next';
import { I18nextProvider } from "react-i18next";
import getAvailableLanguages from '../src/apis/getAvailableLanguages';

i18next.languages = getAvailableLanguages();

const resources = i18next.languages.reduce((accumulator, language, ) => {
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
i18next.init(options);

export default function I18nDecorator(Story){
  return (
    <I18nextProvider i18n={i18next}>
      <Story />
    </I18nextProvider>
  );
}
