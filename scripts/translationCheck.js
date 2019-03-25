const fs = require('fs');

const i18nFolder = '../i18n';
const baseFile = `${i18nFolder}/translation-en.json`;
const baseTranslationData = require(baseFile); 
const files = [
  `${i18nFolder}/translation-en.json`,
  `${i18nFolder}/translation-fr.json`,
  `${i18nFolder}/translation-nl.json`,
  `${i18nFolder}/translation-zh_cn.json`
];

const translationCheck = () => {
  files
    .filter(file => file !== baseFile)
    .forEach(file => {
      const translationData = require(file);
      let updatedData = {};
      addMissingKey(baseTranslationData, translationData, updatedData);

      fs.writeFileSync(i18nFolder + '/' + file, JSON.stringify(updatedData, null, 2));
    });
};
const addMissingKey = (baseTranslationData, translationData, result) => {
  Object.keys(baseTranslationData).reduce((result, key) => {
    if (!translationData[key]) {
      result[key] = typeof baseTranslationData[key] === 'object' 
        ? addMissingKey(baseTranslationData[key], {}, result) 
        : 'MISSING_TRANSLATION';
    } else if (typeof baseTranslationData[key] === 'object') {
      addMissingKey(baseTranslationData[key], translationData, result);
    } else {
      result[key] = translationData[key];
    }
  }, result);
};

translationCheck();


