import { saveAs } from 'file-saver';

import core from 'core';
import { isIE } from 'helpers/device';
import actions from 'actions';

export default (dispatch, options) => {
  const { documentPath = 'document', filename, includeAnnotations = true, xfdfData, externalURL } = options;

  return new Promise(resolve => {
    const downloadOptions = { downloadType: 'pdf' };
    let file;

    const freeHandCompletePromise = core.getTool('AnnotationCreateFreeHand').complete();

    const annotationsPromise = includeAnnotations ? core.getAnnotationsLoadedPromise() : Promise.resolve();
    Promise.all([annotationsPromise, freeHandCompletePromise]).then(() => {
      if (includeAnnotations) {
        downloadOptions.xfdfString = xfdfData || core.exportAnnotations();
      }

      const getDownloadFilename = (name, extension) => {
        if (name && name.slice(-extension.length).toLowerCase() !== extension) {
          name += extension;
        }
        return name;
      };

      dispatch(actions.openElement('loadingModal'));

      const name = filename || documentPath.split('/').slice(-1)[0];
      const downloadName = getDownloadFilename(name, '.pdf');

      const doc = core.getDocument();
      const bbURLPromise = externalURL ? Promise.resolve({ url: externalURL }) : doc.getDownloadLink({ filename: downloadName });
      
      if (bbURLPromise) {
      const downloadIframe = document.getElementById('download-iframe') || document.createElement('iframe');
        downloadIframe.width = 0;
        downloadIframe.height = 0;
        downloadIframe.id = 'download-iframe';
        downloadIframe.src = null;
        document.body.appendChild(downloadIframe);
        bbURLPromise.then(result => {
          downloadIframe.src = result.url;
          dispatch(actions.closeElement('loadingModal'));
          $(document).trigger('finishedSavingPDF');
        });
      } else {
        doc.getFileData(downloadOptions).then(data => {
          const arr = new Uint8Array(data);
          if (isIE) {
            file = new Blob([arr], { type: 'application/pdf' });
          } else {
            file = new File([arr], downloadName, { type: 'application/pdf' });
          }

          saveAs(file, downloadName);
          dispatch(actions.closeElement('loadingModal'));
          $(document).trigger('finishedSavingPDF');
          resolve();
        }, error => {
          dispatch(actions.closeElement('loadingModal'));
          throw new Error(error.message);
        });
      }
    });
  });
};
