import Feature from 'constants/feature';
import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import disableFeatures from './disableFeatures';

export default store => () => {
  warnDeprecatedAPI(
    'disableDownload()',
    'disableFeatures([instance.Feature.Download])',
    '7.0',
  );
  disableFeatures(store)([Feature.Download]);
};
