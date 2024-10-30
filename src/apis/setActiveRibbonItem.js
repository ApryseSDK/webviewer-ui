/**
 * Sets a Ribbon Item as active in the Modular UI.
 * @method UI.setActiveRibbonItem
 * @param {string} ribbonItem dataElement of the ribbon item to set as active.
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.setActiveRibbonItem('toolbarGroup-Annotate');
  });
 */

import actions from 'actions';

export default (store) => (ribbonItem) => {
  store.dispatch(actions.setActiveCustomRibbon(ribbonItem));
};