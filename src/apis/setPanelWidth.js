/**
 * Sets the current width of a panel
 * @method UI.setPanelWidth
 * @param {string} dataElement Panel element to set width of
 * @param {number} width Width to set the panel to
 * @example
 WebViewer(...)
 .then(function(instance) {
 // open left panel
 instance.UI.openElements([ 'leftPanel' ]);
 // Set the width of the left panel to 238px
 instance.UI.setPanelWidth('leftPanel', 238);
 */

import actions from 'actions';
import { panelMinWidth } from 'constants/panel';

export default (store) => (dataElement, width) => {
  const { checkTypes, TYPES } = window.Core;
  checkTypes([dataElement, width], [TYPES.STRING, TYPES.NUMBER], 'UI.setPanelWidth');

  const minAllowedWidth = panelMinWidth;
  const maxAllowedWidth = window.innerWidth;
  if (width < minAllowedWidth) {
    console.warn(`UI.setPanelWidth: width cannot be less than ${minAllowedWidth}px. Setting width to ${minAllowedWidth}px`);
    width = minAllowedWidth;
  } else if (width > maxAllowedWidth) {
    console.warn(`UI.setPanelWidth: width cannot be greater than ${maxAllowedWidth}px. Setting width to ${maxAllowedWidth}px`);
    width = maxAllowedWidth;
  }

  // For default panels, we use a dataElement specific action to set the width
  // Check if the dataElement specific action exists, if it does, use it as well
  const testAction = actions[`set${capitalize(dataElement)}Width`];
  if (testAction && typeof testAction === 'function') {
    store.dispatch(testAction(width));
  }
  store.dispatch(actions.setPanelWidth(dataElement, width));
};

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);