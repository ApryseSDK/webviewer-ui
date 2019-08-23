import i18next from 'i18next';

import core from 'core';
import getBackendPromise from 'helpers/getBackendPromise';
import { fireError } from 'helpers/fireEvent';
import { engineTypes, workerTypes } from 'constants/types';
import { supportedPDFExtensions, supportedOfficeExtensions, supportedBlackboxExtensions, supportedExtensions, supportedClientOnlyExtensions } from 'constants/supportedFiles';
import actions from 'actions';

export default (state, dispatch) => {
  core.closeDocument(dispatch).then(() => {
    checkByteRange(state).then(streaming => {
      Promise.all([getPartRetriever(state, streaming, dispatch), getDocOptions(state, dispatch, streaming)])
        .then(params => {
          const partRetriever = params[0];
          const docOptions = params[1];

          if (partRetriever.on) {
            // If its a blackbox part retriever but the user uploaded a local file,
          // we dont set this because we already show an upload modal
            if (!partRetriever._isBlackboxLocalFile) {
              partRetriever.on('documentLoadingProgress', (e, loaded, total) => {
                dispatch(actions.setDocumentLoadingProgress(loaded / total));
              });
            }
            partRetriever.on('error', function(e, type, message) {
              fireError(message);
            });
          }
          if (partRetriever.setErrorCallback) {
            partRetriever.setErrorCallback(fireError);
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
        },
      });
    }
  });
};

const getPartRetriever = (state, streaming, dispatch) => {
  const { path, initialDoc, file, isOffline, pdfDoc, ext } = state.document;
  let { filename } = state.document;
  const { azureWorkaround, customHeaders, decrypt, decryptOptions, externalPath, pdftronServer, disableWebsockets, useDownloader, withCredentials, singleServerMode, cacheKey } = state.advanced;
  let documentPath = path || initialDoc;

  const engineType = getEngineType(state);

  if (ext && !filename) {
    filename = createFakeFilename(initialDoc, ext);
  }

  return new Promise(resolve => {
    let partRetriever;
    let partRetrieverName = '';
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
      const blackboxOptions = { disableWebsockets, singleServerMode, cacheKey };
      const needsUpload = file && file.name;

      // If PDFTron server is set and they try and upload a local file
      if (needsUpload) {
        documentPath = null; // (BlackBoxPartRetriever does upload when this is null)
        blackboxOptions.uploadData = {
          fileHandle: file,
          loadCallback: () => {},
          onProgress: e => {
            dispatch(actions.setUploadProgress(e.loaded / e.total));
          },
          extension: file.name.split('.').pop(),
        };
        blackboxOptions.filename = file.name;

        dispatch(actions.setIsUploading(true)); // this is reset in onDocumentLoaded event
      }

      partRetriever = new window.CoreControls.PartRetrievers.BlackBoxPartRetriever(documentPath, pdftronServer, blackboxOptions);
      if (needsUpload) {
        partRetriever._isBlackboxLocalFile = true;
      }
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
      console.warn(`Loading %c${documentPath}%c with %c${partRetrieverName}`, 'font-weight: bold; color: blue', '', 'font-weight: bold; color: red');
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
      dispatch(actions.setDocumentType(workerTypes.XOD));
      resolve(docId);
    } else {
      const { pdfWorkerTransportPromise, officeWorkerTransportPromise, forceClientSideInit } = state.advanced;

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
          },
        };

        const docName = getDocName(state);
        const options = { docName, pdfBackendType, officeBackendType, engineType, workerHandlers, pdfWorkerTransportPromise, officeWorkerTransportPromise, forceClientSideInit };
        const { type, extension, workerTransportPromise } = getDocTypeData(options);
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

        resolve({ docId, pdfBackendType, officeBackendType, extension, getPassword, onError, streaming, type, workerHandlers, workerTransportPromise, forceClientSideInit });
      });
    }
  });
};

const getEngineType = state => {
  const docName = getDocName(state);
  const fileExtension = getDocumentExtension(docName);
  const { pdftronServer } = state.advanced;

  let engineType = state.advanced.engineType;
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
  let { path, filename, initialDoc, ext } = state.document;
  if (ext && !filename) {
    filename = createFakeFilename(path || initialDoc, ext);
  }
  return filename || path || initialDoc;
};

const createFakeFilename = (initialDoc, ext) => `${initialDoc.replace(/^.*[\\\/]/, '')}.${ext.replace(/^\./, '')}`;

export const isOfficeExtension = extension => supportedOfficeExtensions.indexOf(extension) !== -1;

export const isPDFExtension = extension => supportedPDFExtensions.indexOf(extension) !== -1;

const getDocTypeData = ({ docName, pdfBackendType, officeBackendType, engineType, workerHandlers, pdfWorkerTransportPromise, officeWorkerTransportPromise }) => {
  const originalExtension = getDocumentExtension(docName);

  let type;
  let extension = originalExtension;
  let workerTransportPromise;

  if (engineType === engineTypes.PDFTRON_SERVER) {
    type = workerTypes.BLACKBOX;
  } else {
    const usingOfficeWorker = supportedOfficeExtensions.indexOf(originalExtension) !== -1;
    if (usingOfficeWorker && !officeWorkerTransportPromise) {
      type = workerTypes.OFFICE;
      workerTransportPromise = window.CoreControls.initOfficeWorkerTransports(officeBackendType, workerHandlers, window.sampleL);
    } else if (!usingOfficeWorker && !pdfWorkerTransportPromise) {
      type = workerTypes.PDF;
      // if the extension isn't pdf or an image then assume it's a pdf
      if (supportedPDFExtensions.indexOf(originalExtension) === -1) {
        extension = 'pdf';
      }
      workerTransportPromise = window.CoreControls.initPDFWorkerTransports(pdfBackendType, workerHandlers, window.sampleL);
    } else if (usingOfficeWorker) {
      type = workerTypes.OFFICE;
      workerTransportPromise = officeWorkerTransportPromise;
    } else {
      type = workerTypes.PDF;
      workerTransportPromise = pdfWorkerTransportPromise;
    }
  }

  return { type, extension, workerTransportPromise };
};
