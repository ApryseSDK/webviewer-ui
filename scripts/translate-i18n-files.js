const fs = require('fs');
const path = require('path');
const { Translate } = require('@google-cloud/translate');

const translate = new Translate({
  keyFilename: path.join(__dirname, '../keys/translation.json'),
});
const i18nFolder = path.join(__dirname, '../i18n');
const baseFile = `${i18nFolder}/translation-en.json`;
const filesToTranslate = fs
  .readdirSync(i18nFolder)
  // filter out .DS_Store
  .filter(fileName => fileName.endsWith('.json'))
  .map(fileName => `${i18nFolder}/${fileName}`)
  .filter(filePath => filePath !== baseFile);

const runTranslation = () => {
  const baseTranslationData = require(baseFile);
  filesToTranslate.forEach(async file => {
    const translationData = require(file);
    const updatedData = {};
    const languageCode = file.match(/translation-(.+?)\.json/i)[1];

    if (!languageCode) {
      console.error(`Can't determine language code of ${file}`);
    }

    await addMissingKey(
      baseTranslationData,
      translationData,
      updatedData,
      languageCode,
    );
    fs.writeFileSync(file, JSON.stringify(updatedData, null, 2));
  });
};

const addMissingKey = (
  baseTranslationData,
  translationData,
  result,
  languageCode,
) =>
  new Promise(resolve => {
    Promise.all(
      Object.keys(baseTranslationData).map(
        key =>
          new Promise(async resolve => {
            if (typeof baseTranslationData[key] === 'object') {
              result[key] = {};
              await addMissingKey(
                baseTranslationData[key],
                // translationData[key] may not exist when the base object is nested so we need to pass an empty object
                // an empty object is okay since the translated values are added to result[key]
                translationData[key] || {},
                result[key],
                languageCode,
              );
            } else if (translationData[key]) {
              result[key] = translationData[key];
            } else {
              const [translated] = await translate.translate(
                baseTranslationData[key],
                mapI18nCodeToGoogleTranslationCode(languageCode),
              );
              result[key] = translated;
            }
            resolve();
          }),
      ),
    ).then(resolve);
  });

const mapI18nCodeToGoogleTranslationCode = code => {
  const map = {
    de: 'de',
    es: 'es',
    fr: 'fr',
    ja: 'ja',
    ko: 'ko',
    nl: 'nl',
    pt_br: 'pt',
    ru: 'ru',
    zh_cn: 'zh-CN',
    zh_tw: 'zh-TW',
  };

  if (!map[code]) {
    throw Error(
      `${code} is missing in the map object in translate-i18n-files.js. Please add it to the map and then run the script again`,
    );
  }

  return map[code];
};

runTranslation();
