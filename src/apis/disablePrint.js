import Feature from 'constants/feature';
import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import disableFeatures from './disableFeatures';

export default store => () => {
  warnDeprecatedAPI(
    'disablePrint()',
    'disableFeatures([instance.Feature.Print])',
    '7.0',
  );
  disableFeatures(store)([Feature.Print]);
};
