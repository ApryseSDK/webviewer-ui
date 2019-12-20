import Feature from 'constants/feature';
import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import disableFeatures from './disableFeatures';

export default store => () => {
  warnDeprecatedAPI(
    'disableAnnotations()',
    'disableFeatures([instance.Feature.Annotations])',
    '7.0',
  );
  disableFeatures(store)([Feature.Annotations]);
};
