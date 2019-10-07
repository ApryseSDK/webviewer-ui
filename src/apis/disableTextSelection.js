import Feature from 'constants/feature';
import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import disableFeatures from './disableFeatures';

export default store => () => {
  warnDeprecatedAPI(
    'disableTextSelection()',
    'disableFeatures([instance.Feature.TextSelection])',
    '7.0',
  );
  disableFeatures(store)([Feature.TextSelection]);
};
