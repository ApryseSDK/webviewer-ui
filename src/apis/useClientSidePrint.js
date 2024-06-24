/**
 * Use/not use embedded or rasterized printing options when connected to a WebViewer Server.
 * @method UI.useClientSidePrint
 * @param {boolean} [use=true] Whether or not to use embedded printing
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.useClientSidePrint(false); // disable embedded printing
  });
 */

import actions from 'actions';

export default (store) => (useClientSidePrint) => {
  store.dispatch(actions.useClientSidePrint(useClientSidePrint));
};