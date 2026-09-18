import actions from 'actions';

const MAX_SIGNATURE_MODAL_COLORS = 3;
const HEX_COLOR_REGEX = /^#[0-9A-F]{6}$/i;

/**
 * Sets the colors available for ink and typed signatures in the signature modal.
 * @method UI.setSignatureModalColors
 * @param {Array.<string>} colors Between one and three six-digit hexadecimal colors.
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.setSignatureModalColors(['#000000', '#4E7DE9', '#E44234']);
  });
 */
export default (store) => function setSignatureModalColors(colors) {
  if (!Array.isArray(colors) || colors.length === 0 || colors.length > MAX_SIGNATURE_MODAL_COLORS) {
    return console.warn('UI.setSignatureModalColors: colors must be an array containing between one and three colors.');
  }

  if (!colors.every((color) => typeof color === 'string' && HEX_COLOR_REGEX.test(color))) {
    // eslint-disable-next-line custom/no-hex-colors
    return console.warn('UI.setSignatureModalColors: each color must be a six-digit hexadecimal color string. For example, #4E7DE9.');
  }

  store.dispatch(actions.setSignatureModalColors(colors));
};
