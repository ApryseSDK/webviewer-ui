/**
 * Returns the active Ribbon Item in the modular UI
 * @method UI.getActiveRibbonItem
 * @return {string} The dataElement of the active Ribbon Item
 * @example
WebViewer(...)
  .then(function(instance) {
    console.log(instance.UI.getActiveRibbonItem());
  });
 */

import selectors from 'selectors';

export default (store) => () => selectors.getActiveCustomRibbon(store.getState());