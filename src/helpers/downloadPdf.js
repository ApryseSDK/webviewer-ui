import core from 'core';
import { isIE } from 'helpers/device';
import actions from 'actions';

export default (dispatch, documentPath = 'document', filename, includeAnnotations = true, xfdfData) => {
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
      const bbURLPromise = doc.getDownloadLink({ filename: downloadName });
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
          if (navigator.msSaveBlob) { // IE11 and Edge 17-
            navigator.msSaveBlob(file, downloadName);
          } else { // every other browser
            const reader = new FileReader();
            reader.onloadend = () => {
              const a = window.parent.document.createElement('a');
              a.href = reader.result;
              a.style.display = 'none';
              a.download = downloadName;
              window.parent.document.body.appendChild(a);
              a.click();
              a.parentNode.removeChild(a);
              dispatch(actions.closeElement('loadingModal'));
              $(document).trigger('finishedSavingPDF');
            };
            reader.readAsDataURL(file);
          }
          resolve();
        }, error => {
          dispatch(actions.closeElement('loadingModal'));
          throw new Error(error.message);
        });
      }
    });
  });
};
