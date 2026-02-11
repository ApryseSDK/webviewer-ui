export default (src, options = {}, extension = '') => {
  return window.Core.performDocumentCreationChecks(src, options, extension);
};