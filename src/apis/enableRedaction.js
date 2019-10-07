import Feature from 'constants/feature';
import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import enableFeatures from './enableFeatures';

export default store => () => {
  warnDeprecatedAPI(
    'enableRedaction()',
    'enableFeatures([instance.Feature.Redaction])',
    '7.0',
  );
  enableFeatures(store)([Feature.Redaction]);
};
