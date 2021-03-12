import { saveAs } from 'file-saver';

import core from 'core';
import { isIE } from 'helpers/device';
import fireEvent from 'helpers/fireEvent';
import actions from 'actions';

export default (dispatch, options = {}) => {
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

  const annotationsPromise = (includeAnnotations && !options.xfdfString) ? core.exportAnnotations({ useDisplayAuthor }) : Promise.resolve('<xfdf></xfdf>');

  return annotationsPromise.then(xfdfString => {
    options.xfdfString = options.xfdfString || xfdfString;

    const getDownloadFilename = (name, extension) => {
      if (name.slice(-extension.length).toLowerCase() !== extension) {
        name += extension;
      }
      return name;
    };

    const downloadName = core.getDocument()?.getType() === 'video' ? filename : getDownloadFilename(filename, '.pdf');
    const doc = core.getDocument();

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
      fireEvent('finishedSavingPDF');
    } else {
      return doc.getFileData(options).then(
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
          fireEvent('finishedSavingPDF');
        },
        error => {
          dispatch(actions.closeElement('loadingModal'));
          throw new Error(error.message);
        },
      );
    }
  }).catch(() => {
    dispatch(actions.closeElement('loadingModal'));
  });
};
