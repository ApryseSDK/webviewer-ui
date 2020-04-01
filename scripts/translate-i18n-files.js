const fs = require('fs');
const path = require('path');
const { Translate } = require('@google-cloud/translate').v2;

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
  const baseTranslationData = JSON.parse(fs.readFileSync(baseFile));
  filesToTranslate.forEach(async file => {
    const translationData = JSON.parse(fs.readFileSync(file));
    const updatedData = {};
    const languageCode = file.match(/translation-(.+?)\.json/i)[1];

    if (!languageCode) {
      console.error(`Can't determine language code of ${file}`);
    }

    try {
      await addMissingKey(baseTranslationData, translationData, updatedData, languageCode);
    } catch (e) {
      console.log(e.message);
    }

    fs.writeFileSync(file, JSON.stringify(updatedData, null, 2));
  });
};

const addMissingKey = async(baseTranslationData, translationData, result, languageCode) => {
  const keys = Object.keys(baseTranslationData);

  for (const key of keys) {
    if (typeof baseTranslationData[key] === 'object') {
      result[key] = {};
      await addMissingKey(
        baseTranslationData[key],
        // translationData[key] may not exist when the base object is nested so we need to pass an empty object
        // an empty object is okay since the translated values are added to result[key]
        translationData[key] || {},
        result[key],
        languageCode
      );
    } else if (typeof translationData[key] === 'string') {
      // a translation already exists, copy it over
      result[key] = translationData[key];
    } else {
      const [translated] = await translate.translate(
        baseTranslationData[key],
        mapI18nCodeToGoogleTranslationCode(languageCode)
      );
      result[key] = translated;
    }
  }
};

const mapI18nCodeToGoogleTranslationCode = code => {
  // key of the map should be the language code that's after the '-' in the json filename.
  // value of a key should be a language code that's listed in https://cloud.google.com/translate/docs/languages
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
    it: 'it',
  };

  if (!map[code]) {
    throw Error(
      `${code} is missing in the map object in translate-i18n-files.js. Please add it to the map and then run the script again`
    );
  }

  return map[code];
};

runTranslation();
