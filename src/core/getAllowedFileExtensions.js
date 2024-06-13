/**
 * https://docs.apryse.com/api/web/Core.html#.getAllowedFileExtensions__anchor
 */
export default () => {
  return window.Core.getAllowedFileExtensions().length > 0 ?
    window.Core.getAllowedFileExtensions().map((format) => `.${format}`,).join(', ') :
    window.Core.SupportedFileFormats.CLIENT.map((format) => `.${format}`,).join(', ');
};
