import { getDocName, getDocumentExtension, isOfficeExtension, isPDFExtension, fireError } from 'helpers/loadDocument';

export default store => {
  window.addEventListener('error', e => {
    const { src } = e.target;
    
    if (!src) {
      // in Safari, an error occurred in web workers will also trigger this event
      // since we handle worker error in loaderror event, we just return here
      return;
    }

    if (src.endsWith('nmf')) {
      testMIMEType(['nmf'], store.getState());
    }
    if (src.endsWith('pexe')) {
      testMIMEType(['pexe'], store.getState());
    }
  }, true);

  window.addEventListener('loaderror', e => {
    if (missFilesToLoad(e)) {
      testMIMEType(['res', 'mem', 'wasm', 'xod'], store.getState());
    }
  });
};

const testMIMEType = (fileExtensions, state) => {
  const docName = getDocName(state);
  const extensionH = getDocumentExtension(docName);

  fileExtensions.forEach(extension => {
    fetch(`${window.CoreControls.getWorkerPath()}/assets/mime-types/test.${extension}`)
      .then(({ status }) => {
        if (status === 404) {
          console.error(`Your server does not have a MIME type set for extension ${extension}. Please see https://www.pdftron.com/documentation/web/guides/basics/troubleshooting-document-loading/#mime-types for more information.`);
        } else {
          if (isOfficeExtension(extensionH)) {
            fetch(`${window.CoreControls.getWorkerPath()}/office/OfficeWorker.js`)
            .then(({ status }) => {
              console.log(status);
              if (status === 404) {
                fireError('Man you are loading a office document but you or your vendor deleted core/office');
              }
            });
          } else if (isPDFExtension(extensionH)) {
            fetch(`${window.CoreControls.getWorkerPath()}/pdf/pdfnet.res`)
            .then(({ status }) => {
              if (status === 404) {
                fireError('Man you are loading a pdf document but you or your vendor deleted core/pdf');
              }
            });
          }
        }
      });
  });
};

const missFilesToLoad = ({ detail }) => {
  return detail === `Couldn't fetch resource file.` 
      || detail === 'The worker has encountered an error'
      || (detail.startsWith('Error retrieving file:') && detail.includes('.xod'));
};
