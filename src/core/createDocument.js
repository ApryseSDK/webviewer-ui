/**
 * https://www.pdftron.com/api/web/Core.html#.createDocument
 */
export default (sourceDoc, docOptions) => {
  return window.Core.createDocument(sourceDoc, docOptions);
};
