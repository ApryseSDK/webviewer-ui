import React from 'react';
import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import bengaliTranslation from '../i18n/translation-bn.json';
import englishTranslation from '../i18n/translation-en.json';
import frenchTranslation from '../i18n/translation-fr.json';
import urduTranslation from '../i18n/translation-ur.json';
import simplifiedChineseTranslation from '../i18n/translation-zh_cn.json';

const resources = {
  bn: {
    translation: bengaliTranslation,
  },
  en: {
    translation: englishTranslation,
  },
  fr: {
    translation: frenchTranslation,
  },
  ur: {
    translation: urduTranslation,
  },
  zh_cn: {
    translation: simplifiedChineseTranslation,
  },
};
const languages = Object.keys(resources);

i18next.languages = languages;

const options = {
  fallbackLng: 'en',
  react: {
    useSuspense: false,
  },
  resources
};
i18next.init(options);
initReactI18next.init(i18next);

export default function I18nDecorator(Story) {
  return (
    <I18nextProvider i18n={i18next}>
      <Story />
    </I18nextProvider>
  );
}
