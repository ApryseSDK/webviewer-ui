/**
 * https://www.pdftron.com/api/web/utils.html#isBlendModeSupported__anchor
 * @see https://www.pdftron.com/api/web/utils.html#isBlendModeSupported__anchor
 */
export default type => {
  if (window.utils.isBlendModeSupported) {
    return window.utils.isBlendModeSupported(type);
  } else {
    return false;
  }
};
