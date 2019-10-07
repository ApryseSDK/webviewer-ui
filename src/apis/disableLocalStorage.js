import Feature from 'constants/feature';
import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import disableFeatures from './disableFeatures';

export default store => () => {
  warnDeprecatedAPI(
    'disableLocalStorage()',
    'disableFeatures([instance.Feature.LocalStorage])',
    '7.0',
  );
  disableFeatures(store)([Feature.LocalStorage]);
};