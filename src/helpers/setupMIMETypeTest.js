import { fireError } from 'helpers/fireEvent';
import { getDocName, getDocumentExtension } from 'helpers/loadDocument';

export default store => {
  window.addEventListener(
    'error',
    e => {
      const { src } = e.target;

      if (!src) {
        // in Safari, an error occurred in web workers will also trigger this event
        // since we handle worker error in loaderror event, we just return here
        return;
      }

      if (src.endsWith('nmf')) {
        testMIMEType(['nmf']).catch(errorMIMEType);
      }
      if (src.endsWith('pexe')) {
        testMIMEType(['pexe']).catch(errorMIMEType);
      }
    },
    true,
  );

  window.addEventListener('loaderror', ({ detail }) => {
    const docExtension = getDocumentExtension(getDocName(store.getState()));

    if (
      typeof detail === 'string' &&
      detail.startsWith('Error retrieving file:') &&
      detail.includes('.xod')
    ) {
      testMIMEType(['xod']).catch(errorMIMEType);
    }
    if (detail === 'The worker has encountered an error') {
      testMIMEType(['mem', 'wasm'])
        .then(() => errorMissingWorkerFiles(docExtension))
        .catch(errorMIMEType);
    }
    if (detail === `Couldn't fetch resource file.`) {
      testMIMEType(['res'])
        .then(() => errorMissingWorkerFiles(docExtension))
        .catch(errorMIMEType);
    }
  });
};

const testMIMEType = fileExtensions => {
  const fetchingTestFiles = fileExtensions.map(
    extension =>
      new Promise((resolve, reject) => {
        const URL = `${window.CoreControls.getWorkerPath()}assets/mime-types/test.${extension}`;

        fetch(URL).then(({ status }) => {
          if (status === 404) {
            reject(extension);
          } else {
            resolve();
          }
        });
      }),
  );

  return Promise.all(fetchingTestFiles);
};

const errorMissingWorkerFiles = docExtension => {
  let errorMessage;

  if (window.CoreControls.SupportedFileFormats.CLIENT_OFFICE.includes(docExtension)) {
    errorMessage =
      'Failed to find Office worker files. This project is not set up to work with Office files.';
  }
  if (window.CoreControls.SupportedFileFormats.CLIENT_PDF.includes(docExtension)) {
    errorMessage =
      'Failed to find PDF worker files. This project is not set up to work with PDF files.';
  }

  fireError(errorMessage);
  console.error(errorMessage);
};

const errorMIMEType = fileExtension => {
  fireError(
    `Your server does not have a MIME type set for extension ${fileExtension}. Open developer console to see the link for correct MIME type setup`,
  );
  console.error(
    `Your server does not have a MIME type set for extension ${fileExtension}. Please see https://www.pdftron.com/documentation/web/faq/mime-types for more information.`,
  );
};
