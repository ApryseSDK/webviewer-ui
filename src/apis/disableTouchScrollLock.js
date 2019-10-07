import Feature from 'constants/feature';
import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import disableFeatures from './disableFeatures';

export default store => () => {
  warnDeprecatedAPI(
    'disableTouchScrollLock()',
    'disableFeatures([instance.Feature.TouchScrollLock])',
    '7.0',
  );
  disableFeatures(store)([Feature.TouchScrollLock]);
};