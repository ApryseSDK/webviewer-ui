import Feature from 'constants/feature';
import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import enableFeatures from './enableFeatures';

export default store => () => {
  warnDeprecatedAPI(
    'enableTouchScrollLock()',
    'enableFeatures([instance.Feature.TouchScrollLock])',
    '7.0',
  );
  enableFeatures(store)([Feature.TouchScrollLock]);
};
