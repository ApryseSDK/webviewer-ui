/**
 * Extract pages from the current document
 * @method WebViewer#extractPagesWithAnnotations
 * @param {Array<number>} pageIndexToExtract An array of pages to extract from the document. Annotations on the pages are included
 * @return {object} A promise that resolve to a <a href='https://developer.mozilla.org/en-US/docs/Web/API/File' target='_blank'>File object</a>
 * @example // 6.0 and after
WebViewer(...)
  .then(function(instance) {
    instance.extractPagesWithAnnotations ([1,2,3]).then(function(fileData){
    });
  });
 */

import core from 'core';

export default pages => core.extractPagesWithAnnotations(pages);