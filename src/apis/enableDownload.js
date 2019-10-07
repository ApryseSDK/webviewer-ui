import Feature from 'constants/feature';
import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import enableFeatures from './enableFeatures';
import disableFeatures from './disableFeatures';

export default store => (enable = true) => {
  if (enable) {
    warnDeprecatedAPI(
      'enableDownload()',
      'enableFeatures([instance.Feature.Download])',
      '7.0',
    );
    enableFeatures(store)([Feature.Download]);
  } else {
    warnDeprecatedAPI(
      'enableDownload(false)',
      'disableFeatures([instance.Feature.Download])',
      '7.0',
    );
    disableFeatures(store)([Feature.Download]);
  }
};
