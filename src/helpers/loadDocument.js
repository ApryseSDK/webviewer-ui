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
  const { azureWorkaround, customHeaders, decrypt, decryptOptions, externalPath, pdftronServer, disableWebsockets, useDownloader, withCredentials } = state.advanced;
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
      partRetriever = new window.CoreControls.PartRetrievers.BlackBoxPartRetriever(documentPath, pdftronServer, { disableWebsockets });
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

const getEngineType = state => {
  const { engineType, pdftronServer } = state.advanced;

  const docName = getDocName(state);
  const fileExtension = getDocumentExtension(docName, engineType);

  if (engineType) {
    return engineType;
  } else if (fileExtension === 'xod') {
    return engineTypes.UNIVERSAL;
  } else if (pdftronServer) {
    return engineTypes.PDFTRON_SERVER;
  } else if (isPDFNetJSExtension(fileExtension)) {
    return engineTypes.PDFNETJS;
  } else {
    return engineTypes.PDFNETJS;
  }
};

export const getDocumentExtension = (doc, engineType) => {
  let extension;

  if (doc) {
    const result = /\.([a-zA-Z]+)(&|$|\?|#)/.exec(doc);
    extension = result && result[1].toLowerCase();
  }

  if (extension) {
    if (!supportedExtensions.includes(extension)) {
      console.error(`File extension ${extension} from ${doc} is not supported.\nWebViewer client only mode supports ${supportedClientOnlyExtensions.join(', ')}.\nWebViewer server supports ${supportedBlackboxExtensions.join(', ')}`);
    }
  } else if (doc && engineType === engineTypes.AUTO) {
    console.warn(`File extension cannot be determined from ${doc}. Falling back to pdf`);
  }

  return extension ? extension : '';
};

export const getDocName = state => {
  // if the filename is specified then use that for checking the extension instead of the doc path
  const { path, filename, initialDoc } = state.document;
  return filename || path || initialDoc;
};

const isPDFNetJSExtension = extension => {
  return isOfficeExtension(extension) || isPDFExtension(extension);
};

export const isOfficeExtension = extension => {
  return supportedOfficeExtensions.indexOf(extension) !== -1;
};

export const isPDFExtension = extension => {
  return supportedPDFExtensions.indexOf(extension) !== -1;
};

const getDocTypeData = ({ docName, pdfBackendType, officeBackendType, engineType, workerHandlers, pdfWorkerTransportPromise, officeWorkerTransportPromise }) => {
  const originalExtension = getDocumentExtension(docName, engineType);

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

