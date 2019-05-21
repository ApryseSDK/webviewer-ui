import i18next from 'i18next';

import core from 'core';
import getBackendPromise from 'helpers/getBackendPromise';
import { fireError } from 'helpers/fireEvent';
import { engineTypes, documentTypes } from 'constants/types';
import { supportedPDFExtensions, supportedOfficeExtensions, supportedBlackboxExtensions, supportedExtensions, supportedClientOnlyExtensions } from 'constants/supportedFiles';
import actions from 'actions';
import selectors from 'selectors';

export default (state, dispatch) => {
  core.closeDocument(dispatch).then(() => {
    checkByteRange(state).then(streaming => {
      Promise.all([getPartRetriever(state, streaming), getDocOptions(state, dispatch, streaming)])
      .then(params => {
        const partRetriever = params[0];
        const docOptions = params[1];

        if (partRetriever.on) {
          partRetriever.on('documentLoadingProgress', (e, loaded, total) => {
            dispatch(actions.setDocumentLoadingProgress(loaded / total));
          });
          partRetriever.on('error', function(e, type, message) {
            fireError(message);
          });
        }
        if (partRetriever.setErrorCallback) {
          partRetriever.setErrorCallback(fireError);
        }
        if (partRetriever instanceof window.CoreControls.PartRetrievers.BlackBoxPartRetriever && isLocalFile(state)) {
          console.error(`${selectors.getDocumentPath(state)} is a local file which is not accessible by the PDFTron server. To solve this, you can either use your own local server or pass a publicly accessible URL`);
        }

        dispatch(actions.openElement('progressModal'));
        core.loadAsync(partRetriever, docOptions);
      })
      .catch(error => {
        fireError(error);
        console.error(error);
      });
    });
  });
};

const checkByteRange = state => {
  let { streaming } = state.advanced;

  return new Promise(resolve => {
    const engineType = getEngineType(state);

    if (engineType !== engineTypes.UNIVERSAL || state.document.isOffline || state.document.file || streaming) {
      resolve(streaming);
    } else {
      $.ajax({
        url: window.location.href,
        cache: false,
        headers: { 'Range': 'bytes=0-0' },
        success: (data, textStatus, jqXHR) => {
          if (jqXHR.status !== 206) {
            streaming = true;
            console.warn('HTTP range requests not supported. Switching to streaming mode.');
          }
          resolve(streaming);
        },
        error: () => {
          streaming = true;
          resolve(streaming);
        }
      });
    }
  });
};

const getPartRetriever = (state, streaming) => {
  const { path, initialDoc, file, isOffline, filename, pdfDoc } = state.document;
  const { azureWorkaround, customHeaders, decrypt, decryptOptions, externalPath, pdftronServer, disableWebsockets, useDownloader, withCredentials, singleServerMode } = state.advanced;
  const documentPath = path || initialDoc;

  const engineType = getEngineType(state);

  return new Promise(resolve => {
    let partRetriever;
    var partRetrieverName = '';
    if (engineType === engineTypes.PDFNETJS) {
      if (pdfDoc) {
        // the PDFDoc object can be used as a part retriever to load into the viewer
        partRetrieverName = 'PDFDoc';
        partRetriever = pdfDoc;
      } else if (file) {
        partRetrieverName = 'LocalPdfPartRetriever';
        partRetriever = new window.CoreControls.PartRetrievers.LocalPdfPartRetriever(file);
      } else {
        partRetrieverName = 'ExternalPdfPartRetriever';
        partRetriever = new window.CoreControls.PartRetrievers.ExternalPdfPartRetriever(documentPath, { useDownloader, withCredentials, filename });
      }
    } else if (engineType === engineTypes.PDFTRON_SERVER) {
      partRetrieverName = 'BlackBoxPartRetriever';
      partRetriever = new window.CoreControls.PartRetrievers.BlackBoxPartRetriever(documentPath, pdftronServer, { disableWebsockets, singleServerMode });
    } else if (engineType === engineTypes.UNIVERSAL) {
      const cache = window.CoreControls.PartRetrievers.CacheHinting.NO_HINT;

      if (file) {
        partRetrieverName = 'LocalPartRetriever';
        partRetriever = new window.CoreControls.PartRetrievers.LocalPartRetriever(file, decrypt, decryptOptions);
      } else if (isOffline) {
        partRetrieverName = 'WebDBPartRetriever';
        partRetriever = new window.CoreControls.PartRetrievers.WebDBPartRetriever(null, decrypt, decryptOptions);
      } else if (window.utils.windowsApp) {
        partRetrieverName = 'WinRTPartRetriever';
        partRetriever = new window.CoreControls.PartRetrievers.WinRTPartRetriever(documentPath, cache, decrypt, decryptOptions);
      } else if (documentPath && documentPath.indexOf('iosrange://') === 0) {
        partRetrieverName = 'IOSPartRetriever';
        partRetriever = new window.CoreControls.PartRetrievers.IOSPartRetriever(documentPath, cache, decrypt, decryptOptions);
      } else if (documentPath && documentPath.indexOf('content://') === 0) {
        partRetrieverName = 'AndroidContentPartRetriever';
        partRetriever = new window.CoreControls.PartRetrievers.AndroidContentPartRetriever(documentPath, cache, decrypt, decryptOptions);
      } else if (externalPath) {
        partRetrieverName = 'ExternalHttpPartRetriever';
        partRetriever = new window.CoreControls.PartRetrievers.ExternalHttpPartRetriever(null, externalPath);
      } else if (streaming) {
        partRetrieverName = 'StreamingPartRetriever';
        partRetriever = new window.CoreControls.PartRetrievers.StreamingPartRetriever(documentPath, cache, decrypt, decryptOptions);
      } else if (azureWorkaround) {
        partRetrieverName = 'AzurePartRetriever';
        partRetriever = new window.CoreControls.PartRetrievers.AzurePartRetriever(documentPath, cache, decrypt, decryptOptions);
      } else {
        partRetrieverName = 'HttpPartRetriever';
        partRetriever = new window.CoreControls.PartRetrievers.HttpPartRetriever(documentPath, cache, decrypt, decryptOptions);
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      console.warn('Loading %c' + documentPath + '%c with %c' + partRetrieverName, 'font-weight: bold; color: blue', '', 'font-weight: bold; color: red');
    }

    if (customHeaders && partRetriever.setCustomHeaders) {
      partRetriever.setCustomHeaders(customHeaders);
    }
    if (withCredentials && partRetriever.setWithCredentials) {
      partRetriever.setWithCredentials(withCredentials);
    }

    resolve(partRetriever);
  });
};

const getDocOptions = (state, dispatch, streaming) => {
  const { id: docId, officeType, pdfType, password } = state.document;
  const engineType = getEngineType(state);

  return new Promise(resolve => {
    if (engineType === engineTypes.UNIVERSAL) {
      dispatch(actions.setDocumentType(documentTypes.XOD));
      resolve(docId);
    } else {
      const { pdfWorkerTransportPromise, officeWorkerTransportPromise } = state.advanced;

      Promise.all([getBackendPromise(pdfType), getBackendPromise(officeType)]).then(([pdfBackendType, officeBackendType]) => {
        let passwordChecked = false; // to prevent infinite loop when wrong password is passed as an argument
        let attempt = 0;
        const getPassword = checkPassword => {
          dispatch(actions.setPasswordAttempts(attempt++));
          if (password && !passwordChecked) {
            checkPassword(password);
            passwordChecked = true;
          } else {
            if (passwordChecked) {
              console.error('Wrong password has been passed as an argument. WebViewer will open password modal.');
            }
            dispatch(actions.setCheckPasswordFunction(checkPassword));
            dispatch(actions.openElement('passwordModal'));
          }
        };
        const onError = error => {
          if (typeof error === 'string') {
            fireError(error);
          } else if (error.type === 'InvalidPDF') {
            fireError(i18next.t('message.badDocument'));
          }
          console.error(error);
        };
        const workerHandlers = {
          workerLoadingProgress: percent => {
            dispatch(actions.setWorkerLoadingProgress(percent));
          }
        };

        const docName = getDocName(state);
        const options = { docName, pdfBackendType, officeBackendType, engineType, workerHandlers, pdfWorkerTransportPromise, officeWorkerTransportPromise };
        let { type, extension, workerTransportPromise } = getDocTypeData(options);
        if (workerTransportPromise) {
          workerTransportPromise.catch(workerError => {
            if (typeof workerError === 'string') {
              fireError(workerError);
              console.error(workerError);
            } else {
              fireError(workerError.message);
              console.error(workerError.message);
            }
          });
        }

        dispatch(actions.setDocumentType(type));

        resolve({ docId, pdfBackendType, officeBackendType, extension, getPassword, onError, streaming, type, workerHandlers, workerTransportPromise });
      });
    }
  });
};

let engineType;
const getEngineType = state => {
  if (engineType) {
    return engineType;
  }

  const docName = getDocName(state);
  const fileExtension = getDocumentExtension(docName);
  const { pdftronServer } = state.advanced;

  engineType = state.advanced.engineType;
  if (engineType === engineTypes.AUTO) {
    if (fileExtension === 'xod') {
      engineType = engineTypes.UNIVERSAL;
    } else if (pdftronServer) {
      engineType = engineTypes.PDFTRON_SERVER;
    } else {
      if (docName && !fileExtension) {
        console.warn(`File extension cannot be determined from ${docName}. Falling back to pdf`);
      }
      engineType = engineTypes.PDFNETJS;
    }
  }

  if (fileExtension) {
    if (!supportedExtensions.includes(fileExtension)) {
      console.error(`File extension ${fileExtension} from ${docName} is not supported. Please see https://www.pdftron.com/documentation/web/guides/file-format-support for a full list of file formats supported by WebViewer`);
    } else if (
      engineType === engineTypes.PDFNETJS &&
      !supportedClientOnlyExtensions.includes(fileExtension) &&
      supportedBlackboxExtensions.includes(fileExtension)
    ) {
      console.error(`File extension ${fileExtension} from ${docName} is only supported by using WebViewer with WebViewer Server. See https://www.pdftron.com/documentation/web/guides/file-format-support for a full list of file formats supported by WebViewer. Visit https://www.pdftron.com/documentation/web/guides/wv-server-deployment for more information about WebViewer Server`);
    }
  }

  return engineType;
};

export const getDocumentExtension = docName => {
  let extension = '';

  if (docName) {
    const result = /\.([a-zA-Z]+)(&|$|\?|#)/.exec(docName);
    extension = result && result[1].toLowerCase();
  }

  return extension;
};

export const getDocName = state => {
  // if the filename is specified then use that for checking the extension instead of the doc path
  const { path, filename, initialDoc } = state.document;
  return filename || path || initialDoc;
};

const getDocTypeData = ({ docName, pdfBackendType, officeBackendType, engineType, workerHandlers, pdfWorkerTransportPromise, officeWorkerTransportPromise }) => {
  const originalExtension = getDocumentExtension(docName);

  let type;
  let extension = originalExtension;
  let workerTransportPromise;

  if (engineType === engineTypes.PDFTRON_SERVER) {
    type = documentTypes.BLACKBOX;
  } else {
    const usingOfficeWorker = supportedOfficeExtensions.indexOf(originalExtension) !== -1;
    if (usingOfficeWorker && !officeWorkerTransportPromise) {
      type = documentTypes.OFFICE;
      workerTransportPromise = window.CoreControls.initOfficeWorkerTransports(officeBackendType, workerHandlers, window.sampleL);
    } else if (!usingOfficeWorker && !pdfWorkerTransportPromise) {
      type = documentTypes.PDF;
      // if the extension isn't pdf or an image then assume it's a pdf
      if (supportedPDFExtensions.indexOf(originalExtension) === -1) {
        extension = 'pdf';
      }
      workerTransportPromise = window.CoreControls.initPDFWorkerTransports(pdfBackendType, workerHandlers, window.sampleL);
    } else if (usingOfficeWorker) {
      type = documentTypes.OFFICE;
      workerTransportPromise = officeWorkerTransportPromise;
    } else {
      type = documentTypes.PDF;
      workerTransportPromise = pdfWorkerTransportPromise;
    }
  }

  return { type, extension, workerTransportPromise };
};

const isLocalFile = state => {
  const path = selectors.getDocumentPath(state);

  return !/https?:\/\//.test(path);
};

