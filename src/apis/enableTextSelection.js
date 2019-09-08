import Feature from 'constants/feature';
import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import enableFeatures from './enableFeatures';
import disableFeatures from './disableFeatures';

export default store => (enable = true) => {
  if (enable) {
    warnDeprecatedAPI(
      'enableTextSelection()',
      'enableFeatures([instance.Feature.TextSelection])',
      '7.0',
    );
    enableFeatures(store)([Feature.Measurement]);
  } else {
    warnDeprecatedAPI(
      'enableTextSelection(false)',
      'disableFeatures([instance.Feature.TextSelection])',
      '7.0',
    );
    disableFeatures(store)([Feature.TextSelection]);
  }
};
