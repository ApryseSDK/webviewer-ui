import Feature from 'constants/feature';
import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import enableFeatures from './enableFeatures';

export default store => () => {
  warnDeprecatedAPI(
    'enableLocalStorage()',
    'enableFeatures([instance.Feature.LocalStorage])',
    '7.0',
  );
  enableFeatures(store)([Feature.LocalStorage]);
};