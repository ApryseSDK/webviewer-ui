import React from 'react';
import i18next from 'i18next';
import { I18nextProvider } from "react-i18next";
import thunk from 'redux-thunk';

i18next.languages = [
  'en',
  'de',
  'es',
  'fr',
  'it',
  'ja',
  'ko',
  'nl',
  'pt_br',
  'ru',
  'zh_cn',
  'zh_tw'
];

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
    wait: true,
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
