/**
 * Extract pages from the current document
 * @method UI.extractPagesWithAnnotations
 * @param {Array<number>} pageNumbersToExtract An array of pages to extract from the document. Annotations on the pages are included
 * @return {Promise<File>} A promise that resolve to a <a href='https://developer.mozilla.org/en-US/docs/Web/API/File' target='_blank'>File object</a>
 * @example // 6.0 and after
WebViewer(...)
  .then(function(instance) {
    instance.UI.extractPagesWithAnnotations ([1,2,3]).then(function(fileData){
    });
  });
 */

import extractPagesWithAnnotations from '../helpers/extractPagesWithAnnotations';

export default pageNumbersToExtract => extractPagesWithAnnotations(pageNumbersToExtract);