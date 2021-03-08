import i18next from 'i18next';
import HttpApi from 'i18next-http-backend';

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

  // set custom rules. since i18next doesn't support 'zh-ch', 'zh-tw', or 'pt-br'
  const plRule = i18next.services.pluralResolver.getRule('pt-BR');
  i18next.services.pluralResolver.addRule('pt_br', plRule);

  const zhRule = i18next.services.pluralResolver.getRule('zh');
  i18next.services.pluralResolver.addRule('zh_ch', zhRule);
  i18next.services.pluralResolver.addRule('zh_tw', zhRule);
};
