import Feature from 'constants/feature';
import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import enableFeatures from './enableFeatures';

export default store => () => {
  warnDeprecatedAPI(
    'enableAnnotations()',
    'enableFeatures([instance.Feature.Annotations])',
    '7.0',
  );
  enableFeatures(store)([Feature.Annotations]);
};
