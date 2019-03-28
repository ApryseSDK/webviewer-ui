const fs = require('fs');
const path = require('path');

const i18nFolder = path.resolve(__dirname, '../i18n');
const baseFile = `${i18nFolder}/translation-en.json`;
const files = [
  `${i18nFolder}/translation-en.json`,
  `${i18nFolder}/translation-fr.json`,
  `${i18nFolder}/translation-nl.json`,
  `${i18nFolder}/translation-zh_cn.json`
];

const translationCheck = () => {
  const baseTranslationData = require(baseFile); 
  files
    .filter(file => file !== baseFile)
    .forEach(file => {
      const translationData = require(file);
      const updatedData = {};

      addMissingKey(baseTranslationData, translationData, updatedData);
      fs.writeFileSync(file, JSON.stringify(updatedData, null, 2));
    });
};
const addMissingKey = (baseTranslationData, translationData, result) => {
  Object.keys(baseTranslationData).forEach(key => {
    if (typeof baseTranslationData[key] === 'object') {
      result[key] = {};
      addMissingKey(baseTranslationData[key], translationData[key], result[key]); 
    } else {
      result[key] = translationData[key] 
        ? translationData[key] 
        : `MISSING_TRANSLATION English: ${baseTranslationData[key]}`;
    }
  });
};

translationCheck();


