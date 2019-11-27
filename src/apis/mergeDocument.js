/**
 * Merge a file into the currently opened document
 * @method WebViewer#mergeDocument
 * @param {(string|File|ArrayBuffer|Blob)} source Source parameter, path/url to document or File.
 * @param {number} [position] Optional position for where to merge the document, default to end of file if nothing entered
 * @returns {Promise<any>} a promise that resolves on completion
 * @example // 6.0 and after
WebViewer(...)
  .then(function(instance) {
    instance.mergeDocument('https://www.pdftron.com/downloads/pl/test.pdf', 1);
  });
 */
import core from 'core';

export default store => (documentToMerge, position) => {
  return core.mergeDocument(store.dispatch, documentToMerge, position);
};