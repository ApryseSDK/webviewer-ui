import Feature from 'constants/feature';
import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import enableFeatures from './enableFeatures';
import disableFeatures from './disableFeatures';

export default store => (enable = true) => {
  if (enable) {
    warnDeprecatedAPI(
      'enableFilePicker()',
      'enableFeatures([instance.Feature.FilePicker])',
      '7.0',
    );
    enableFeatures(store)([Feature.Measurement]);
  } else {
    warnDeprecatedAPI(
      'enableFilePicker(false)',
      'disableFeatures([instance.Feature.FilePicker])',
      '7.0',
    );
    disableFeatures(store)([Feature.FilePicker]);
  }
};