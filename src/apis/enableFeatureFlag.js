/**
 * Enables a specified feature flag.
 * @method UI.enableFeatureFlag
 * @param {string} featureFlag The feature flag to enable. To find feature flag names, refer to <a href='https://docs.apryse.com/documentation/web/guides/feature-flags/#feature-flags' target='_blank'>Feature flags</a>.
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.enableFeatureFlag(instance.UI.FeatureFlags.CUSTOMIZABLE_UI);
  });
 */

import actions from 'actions';
import FEATURE_FLAGS from 'constants/featureFlags';

export default (store) => (featureFlag) => {
  const featureFlags = Object.values(FEATURE_FLAGS);
  if (!featureFlags.includes(featureFlag)) {
    console.warn(`Feature flag ${featureFlag} does not exist.`);
  } else {
    store.dispatch(actions.enableFeatureFlag(featureFlag));
  }
};