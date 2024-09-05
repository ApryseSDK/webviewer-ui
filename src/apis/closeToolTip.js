/**
 * Closes the tooltip that is currently being hovered over
 * @method UI.closeTooltip
 * @example
 WebViewer(...)
 .then(function(instance) {
 // call close after tooltip opens
 instance.UI.addEventListener('tooltipOpened', function() {
 instance.UI.closeTooltip();
 });
 });
 */

import { getCloseToolTipFunc } from 'helpers/hotkeysManager';

export default () => {
  getCloseToolTipFunc()?.();
};
