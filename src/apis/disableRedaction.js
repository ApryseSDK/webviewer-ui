import Feature from 'constants/feature';
import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import disableFeatures from './disableFeatures';

export default store => () => {
  warnDeprecatedAPI(
    'disableRedaction()',
    'disableFeatures([instance.Feature.Redaction])',
    '7.0',
  );
  disableFeatures(store)([Feature.Redaction]);
};
