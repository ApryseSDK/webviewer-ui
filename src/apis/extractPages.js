/**
 * Extract pages from the current document
 * @method WebViewer#extractPages
 * @param {Array<number>} pageindexToExtract An array of page numbers to extract
 * @example // 6.0 and after
WebViewer(...)
  .then(function(instance) {
    instance.extractPages([1,2,3]).then(function(fileData){
    });
  });
 */
import { isIE } from 'helpers/device';

export default store => async pagesToExtract => {
  const doc = window.readerControl.docViewer.getDocument();

  const pagesToExtractHash = pagesToExtract.reduce((curr, val) => {
    curr[val] = true;
    return curr;
  }, {});

  const annotManager = window.readerControl.docViewer.getAnnotationManager();
  const annotList = annotManager.getAnnotationsList().filter(annot => pagesToExtractHash[annot.PageNumber]);
  const xfdfString = await annotManager.exportAnnotations({ annotList });

  const finishPromise = new Promise(function(resolve, reject) {
    try {
      doc.extractPages(pagesToExtract, xfdfString).then(data => {
        const arr = new Uint8Array(data);
        const documentStore = store.getState().document;
        let fileName = documentStore.fileName;

        if (!fileName && documentStore.initialDoc) {
          fileName = documentStore.initialDoc.split('/').pop();
        } else {
          fileName = 'extractedDocument.pdf';
        }

        let file = null;
        if (isIE) {
          file = new Blob([arr], { type: 'application/pdf' });
        } else {
          file = new File([arr], fileName, { type: 'application/pdf' });
        }

        resolve(file);
      }).catch(function(ex) {
        reject(ex);
      });
    } catch (ex) {
      reject(ex);
    }
  });

  return finishPromise;
}; 
