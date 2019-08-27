import i18next from 'i18next';
import XHR from 'i18next-xhr-backend';

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
  };

  if (state.advanced.disableI18n) {
    i18next.init(options, callback);
  } else {
    i18next.use(XHR).init(
      {
        ...options,
        backend: {
          loadPath: './i18n/{{ns}}-{{lng}}.json',
        },
      },
      callback,
    );
  }
};
