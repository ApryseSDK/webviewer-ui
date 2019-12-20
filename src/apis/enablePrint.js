import Feature from 'constants/feature';
import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import enableFeatures from './enableFeatures';
import disableFeatures from './disableFeatures';

export default store => (enable = true) => {
  if (enable) {
    warnDeprecatedAPI(
      'enablePrint()',
      'enableFeatures([instance.Feature.Print])',
      '7.0',
    );
    enableFeatures(store)([Feature.Print]);
  } else {
    warnDeprecatedAPI(
      'enablePrint(false)',
      'disableFeatures([instance.Feature.Print])',
      '7.0',
    );
    disableFeatures(store)([Feature.Print]);
  }
};
