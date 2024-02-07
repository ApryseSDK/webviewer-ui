/**
 * Sets the position of the scale overlay.
 * @method UI.setScaleOverlayPosition
 * @param {string} newPosition Must be one of the following: 'top-left', 'top-right', 'bottom-left', 'bottom-right'
 * @example
 WebViewer(...)
 .then(function(instance) {
 instance.UI.setScaleOverlayPosition('bottom-right')
 });
 */

import actions from 'actions';

export default (store) => (position) => {
  const { checkTypes, TYPES } = window.Core;
  checkTypes([position], [TYPES.ONE_OF('top-left', 'top-right', 'bottom-left', 'bottom-right')], 'UI.setScaleOverlayPosition');
  store.dispatch(actions.setScaleOverlayPosition(position));
};