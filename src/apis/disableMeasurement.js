import Feature from 'constants/feature';
import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import disableFeatures from './disableFeatures';

export default store => () => {
  warnDeprecatedAPI(
    'disableMeasurement()',
    'disableFeatures([instance.Feature.Measurement])',
    '7.0',
  );
  disableFeatures(store)([Feature.Measurement]);
};