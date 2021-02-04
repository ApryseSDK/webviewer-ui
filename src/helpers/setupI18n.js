import i18next from 'i18next';
import HttpApi from 'i18next-http-backend';
import languageRules from '../constants/languageRules';

// https://github.com/isaachinman/next-i18next/issues/562
// the values in this array should match the language codes of the json files inside the i18n folder
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

export default state => {
  const options = {
    fallbackLng: 'en',
    react: {
      useSuspense: false,
      wait: true,
    },
  };
  const callback = (err, t) => {
    window.Annotations.Utilities.setAnnotationSubjectHandler(type =>
      t(`annotation.${type}`),
    );

    window.Tools.SignatureCreateTool.setTextHandler(() =>
      t('message.signHere'),
    );

    window.Tools.FreeTextCreateTool.setTextHandler(() =>
      t('message.insertTextHere'),
    );

    window.Tools.CalloutCreateTool.setTextHandler(() =>
      t('message.insertTextHere'),
    );
  };

  if (state.advanced.disableI18n) {
    i18next.init(options, callback);
  } else {
    i18next.use(HttpApi).init(
      {
        ...options,
        backend: {
          loadPath: './i18n/{{ns}}-{{lng}}.json',
        },
      },
      callback,
    );
  }

  // set custom rules. since i18next doesn't support (i.e 'zh-ch', 'zh-tw', or 'pt-br')
  // have to look inside the i18n source code "getRule" function to see what rule we can copy
  Object.keys(languageRules).forEach(lang => {
    if (languageRules[lang].i18next) {
      const rule = i18next.services.pluralResolver.getRule(languageRules[lang].i18next);
      i18next.services.pluralResolver.addRule(lang, rule);
    }
  });
};
