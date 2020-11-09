import { isIE } from 'helpers/device';

export default async pageNumbersToExtract => {
  const doc = window.docViewer.getDocument();
  const annotManager = window.docViewer.getAnnotationManager();

  const pageCount = doc.getPageCount();
  const pageOutOfRange = pageNumbersToExtract.some(page => page < 1 || page > pageCount);

  if (pageOutOfRange) {
    return Promise.reject(`Page out of range, please enter an array of numbers between 1 and ${pageCount}`);
  }

  const finishPromise = new Promise(function(resolve, reject) {
    try {
      const pageMap = new Map();
      pageNumbersToExtract.forEach(page => pageMap.set(page, true));

      const annotList = annotManager.getAnnotationsList().filter(annot => pageMap.has(annot.PageNumber));
      annotManager.exportAnnotations({ annotList }).then(xfdfString => {
        doc.extractPages(pageNumbersToExtract, xfdfString).then(data => {
          const arr = new Uint8Array(data);
          const fileName = `${doc.getFilename()}.pdf` || 'extractedDocument.pdf';

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
      });
    } catch (ex) {
      reject(ex);
    }
  });

  return finishPromise;
};
