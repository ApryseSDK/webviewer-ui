/**
 * Merge a file into the currently opened document
 * @method WebViewer#mergeDocument
 * @param {(string|File)} documentPath Path to the document OR <a href='https://developer.mozilla.org/en-US/docs/Web/API/File' target='_blank'>File object</a> if opening local file.
 * @param {number} position Position to put the merged document, default to end of file if nothing entered
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    instance.mergeDocument('https://www.pdftron.com/downloads/pl/test.pdf', 1);
  });
 */
import actions from 'actions';

export default store => (documentToMerge, position) => {
  const doc = window.docViewer.getDocument();
  const CoreControls = window.CoreControls;

  let ext = null;
  let partRetriever;

  if (typeof documentToMerge === 'string') {
    partRetriever = new CoreControls.PartRetrievers.ExternalPdfPartRetriever(documentToMerge);
    ext = 'pdf';
  } else {
    ext = documentToMerge.name.split('.').slice(-1)[0];
    partRetriever = new CoreControls.PartRetrievers.LocalPdfPartRetriever(documentToMerge);
  }

  const finishPromise = new Promise(function(resolve, reject) {
    try {
      store.dispatch(actions.openElement('progressModal'));
      CoreControls.getDefaultBackendType().then(function(backendType) {
        const options = {
          workerTransportPromise: CoreControls.initPDFWorkerTransports(backendType, {}),
          extension: ext,
        };
        const newDoc = new CoreControls.Document('fileToMerge', 'pdf');
        newDoc.loadAsync(partRetriever, function(err) {
          if (err) {
            console.error('Could not open file, please try again');
            return;
          }
          const pages = [];
          for (let i = 0; i < newDoc.numPages; i++) {
            pages.push(i + 1);
          }

          if (position === null || position === undefined) {
            // 'insertPages', default is insert at the start of file if no value given, also we can use 'Number.MAX_VALUE' to make it insert at the end
            position = window.docViewer.getPageCount() + 1;
          }

          doc.insertPages(newDoc, pages, position).then(() => {
            store.dispatch(actions.closeElement('progressModal'));
            resolve(arguments);
          }).catch(err => {
            reject(err);
            store.dispatch(actions.closeElement('progressModal'));
          });
        }, options);

        partRetriever.on('documentLoadingProgress', (e, loaded, total) => {
          store.dispatch(actions.setDocumentLoadingProgress(loaded / total));
        });
      });
    } catch (ex) {
      reject(ex);
      store.dispatch(actions.closeElement('progressModal'));
    }
  });

  return finishPromise;
};