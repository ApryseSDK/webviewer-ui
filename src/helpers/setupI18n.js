import i18next from 'i18next';
import XHR from 'i18next-xhr-backend';

export default state => {
  const options =  {
    fallbackLng: 'en',
    react: {
      wait: true
    }
  };
  const callback = (err, t) => {
    window.Annotations.Utilities.setAnnotationSubjectHandler(type => {
      return t('annotation.' + type);
    });

    window.Tools.SignatureCreateTool.setTextHandler(() => {
      return t('message.signHere');
    });

    window.Tools.FreeTextCreateTool.setTextHandler(() => {
      return t('message.insertTextHere');
    });
  };

  if (state.advanced.disableI18n) {
    i18next.init(options, callback);
  } else {
    i18next
    .use(XHR)
    .init({ 
      ...options,  
      backend: {
        loadPath: './i18n/{{ns}}-{{lng}}.json'
      }
    }, callback);
  }
};
