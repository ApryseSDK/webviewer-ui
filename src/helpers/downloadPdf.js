import FileSaver from 'file-saver';

import core from 'core';
import { isIE } from 'helpers/device';
import actions from 'actions';

export default (dispatch, documentPath = 'document', filename, includeAnnotations = true, xfdfData) => {
  core.getTool('AnnotationCreateFreeHand').complete();

  return new Promise(resolve => {
    const downloadOptions = { downloadType: 'pdf' };
    let file;

    const annotationsPromise = includeAnnotations ? core.getAnnotationsLoadedPromise() : Promise.resolve();
    annotationsPromise.then(() => {
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

      const doc = core.getDocument();
      const bbURLPromise = doc.getDownloadLink();
      if (bbURLPromise) {
        const downloadIframe = document.getElementById('download-iframe') || document.createElement('iframe');
        downloadIframe.width = 0;
        downloadIframe.height = 0;
        downloadIframe.id = 'download-iframe';
        document.body.appendChild(downloadIframe);
        bbURLPromise.then(result => {
          downloadIframe.src = result.url;
          dispatch(actions.closeElement('loadingModal'));
          $(document).trigger('finishedSavingPDF');
        });
      } else {
        doc.getFileData(downloadOptions).then(data => {
          const arr = new Uint8Array(data);
          const name = filename || documentPath.split('/').slice(-1)[0];
          if (isIE) {
            file = new Blob([arr], { type: 'application/pdf' });
          } else {
            file = new File([arr], getDownloadFilename(name, '.pdf'), { type: 'application/pdf' });
          }
          FileSaver.saveAs(file, getDownloadFilename(name, '.pdf'));
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
