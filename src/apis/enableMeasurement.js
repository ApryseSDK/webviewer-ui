import Feature from 'constants/feature';
import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import enableFeatures from './enableFeatures';

export default store => () => {
  warnDeprecatedAPI(
    'enableMeasurement()',
    'enableFeatures([instance.Feature.Measurement])',
    '7.0',
  );
  enableFeatures(store)([Feature.Measurement]);
};
