import { saveAs } from 'file-saver';

import core from 'core';
import { isIE } from 'helpers/device';
import fireEvent from 'helpers/fireEvent';
import Events from 'constants/events';
import actions from 'actions';

export default async (dispatch, options = {}) => {
  const {
    filename = core.getDocument()?.getFilename() || 'document',
    includeAnnotations = true,
    externalURL,
    useDisplayAuthor = false,
  } = options;

  if (!options.downloadType) {
    options.downloadType = 'pdf';
  }

  dispatch(actions.openElement('loadingModal'));

  let annotationsPromise = Promise.resolve();
  if (includeAnnotations && !options.xfdfString) {
    if (options.documentToBeDownloaded) {
      annotationsPromise = Promise.resolve((await options.documentToBeDownloaded.extractXFDF()).xfdfString);
    } else {
      annotationsPromise = core.exportAnnotations({ useDisplayAuthor });
    }
  }

  return annotationsPromise.then(xfdfString => {
    options.xfdfString = options.xfdfString || xfdfString;
    if (!includeAnnotations) {
      options.includeAnnotations = false;
    }

    const getDownloadFilename = (name, extension) => {
      if (name.slice(-extension.length).toLowerCase() !== extension) {
        name += extension;
      }
      return name;
    };

    const downloadName =
      (core.getDocument()?.getType() === 'video' || core.getDocument()?.getType() === 'audio')
        ? filename
        : getDownloadFilename(filename, '.pdf');
    let doc = core.getDocument();

    // Cloning the options object to be able to delete the customDocument property if needed.
    // doc.getFileData(options) will throw an error if this customDocument property is passed in
    const clonedOptions = Object.assign({}, options);
    if (clonedOptions.documentToBeDownloaded) {
      doc = clonedOptions.documentToBeDownloaded;
      delete clonedOptions.documentToBeDownloaded;
    }

    if (externalURL) {
      const downloadIframe =
        document.getElementById('download-iframe') ||
        document.createElement('iframe');
      downloadIframe.width = 0;
      downloadIframe.height = 0;
      downloadIframe.id = 'download-iframe';
      downloadIframe.src = null;
      document.body.appendChild(downloadIframe);
      downloadIframe.src = externalURL;
      dispatch(actions.closeElement('loadingModal'));
      fireEvent(Events.FINISHED_SAVING_PDF);
      fireEvent(Events.FILE_DOWNLOADED);
    } else {
      return doc.getFileData(clonedOptions).then(
        data => {
          const arr = new Uint8Array(data);
          let file;

          if (isIE) {
            file = new Blob([arr], { type: 'application/pdf' });
          } else {
            file = new File([arr], downloadName, { type: 'application/pdf' });
          }

          saveAs(file, downloadName);
          dispatch(actions.closeElement('loadingModal'));
          fireEvent(Events.FINISHED_SAVING_PDF);
          fireEvent(Events.FILE_DOWNLOADED);
        },
        error => {
          dispatch(actions.closeElement('loadingModal'));
          throw new Error(error.message);
        },
      );
    }
  }).catch(error => {
    console.warn(error);
    dispatch(actions.closeElement('loadingModal'));
  });
};
