import { saveAs } from 'file-saver';
import core from 'core';
import { isIE } from 'helpers/device';
import fireEvent from 'helpers/fireEvent';
import Events from 'constants/events';
import actions from 'actions';
import { creatingPages } from 'helpers/print';
import selectors from 'selectors';
import html2canvas from 'html2canvas';


export default async (dispatch, options = {}, documentViewerKey = 1) => {
  let doc = core.getDocument(documentViewerKey);
  const {
    filename = doc?.getFilename() || 'document',
    includeAnnotations = true,
    externalURL,
    useDisplayAuthor = false,
    pages,
    includeComments = false,
    store, // Must be defined if includeComments is true
  } = options;

  if (!options.downloadType) {
    options.downloadType = 'pdf';
  }
  const downloadAsImage = options.downloadType === 'png';

  dispatch(actions.openElement('loadingModal'));

  if (downloadAsImage) {
    const state = store.getState();
    const [
      sortStrategy,
      dateFormat,
      language,
      printQuality,
      colorMap,
    ] = [
      selectors.getSortStrategy(state),
      selectors.getPrintedNoteDateFormat(state),
      selectors.getCurrentLanguage(state),
      selectors.getPrintQuality(state),
      selectors.getColorMap(state),
    ];
    const id = 'download-handler-css';
    if (!document.getElementById(id)) {
      const style = window.document.createElement('style');
      style.id = id;
      style.textContent = `
        img {
          display: block !important;
          max-width: 100%;
          max-height: 100%;
          height: 100%;
          width: 100%;
          object-fit: contain;
          page-break-after: always;
          padding: 0;
          margin: 0;
        }
  
        .page__container {
          box-sizing: border-box;
          display: flex !important;
          flex-direction: column;
          padding: 10px;
          min-height: 100%;
          min-width: 100%;
          font-size: 10px;
        }
  
        .page__container .page__header {
          display: block !important;
          align-self: flex-start;
          font-size: 2rem;
          margin-bottom: 2rem;
          padding-bottom: 0.6rem;
          border-bottom: 0.1rem solid black;
        }
  
        .page__container .note {
          display: flex !important;
          flex-direction: column;
          padding: 0.6rem;
          border: 0.1rem lightgray solid;
          border-radius: 0.4rem;
          margin-bottom: 0.5rem;
        }
  
        .page__container .note .note__info {
          display: block !important;
          font-size: 1.3rem;
          margin-bottom: 0.1rem;
        }
  
        .page__container .note .note__info--with-icon {
          display: flex !important;
        }
  
        .page__container .note .note__info--with-icon .note__icon {
          display: block !important;
          width: 1.65rem;
          height: 1.65rem;
          margin-top: -0.1rem;
          margin-right: 0.2rem;
        }
  
        .page__container .note .note__info--with-icon .note__icon path:not([fill=none]) {
          display: block !important;
          fill: currentColor;
        }
  
        .page__container .note .note__root .note__content {
          display: block !important;
          margin-left: 0.3rem;
        }
  
        .page__container .note .note__root {
          display: block !important;
        }
  
        .page__container .note .note__info--with-icon .note__icon svg {
          display: block !important;
        }
  
        .page__container .note .note__reply {
          display: block !important;
          margin: 0.5rem 0 0 2rem;
        }
  
        .page__container .note .note__content {
          display: block !important;
          font-size: 1.2rem;
          margin-top: 0.1rem;
        }
      `;
      window.document.head.prepend(style);
    }
    const createdPages = creatingPages(
      pages,
      includeComments,
      includeAnnotations,
      true,
      printQuality,
      sortStrategy,
      colorMap,
      dateFormat,
      undefined,
      false,
      language,
      true,
    );
    for (let page of createdPages) {
      page = await page;
      let dataURL;
      if (page instanceof HTMLElement) {
        document.body.appendChild(page);
        const canvas = await html2canvas(page, {
          backgroundColor: null,
          scale: 1,
          logging: false,
        });
        dataURL = canvas.toDataURL();
        document.body.removeChild(page);
      } else {
        dataURL = page;
      }
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = `${filename}.png`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    dispatch(actions.closeElement('loadingModal'));
    fireEvent(Events.FINISHED_SAVING_PDF);
    fireEvent(Events.FILE_DOWNLOADED);
    return;
  }

  let annotationsPromise = Promise.resolve();
  const convertToPDF = options.downloadType === 'pdf' && doc.getType() === 'office';
  if (convertToPDF) {
    const xfdfString = await core.getAnnotationManager(documentViewerKey).exportAnnotations({ fields: true, widgets: true, links: true });
    const fileData = await doc.getFileData({ xfdfString, includeAnnotations, downloadType: 'pdf' });
    doc = await core.createDocument(fileData, { extension: 'pdf' });
    annotationsPromise = Promise.resolve(xfdfString);
  } else if (includeAnnotations && !options.xfdfString && !downloadAsImage) {
    if (options.documentToBeDownloaded) {
      annotationsPromise = Promise.resolve((await options.documentToBeDownloaded.extractXFDF(pages)).xfdfString);
    } else {
      annotationsPromise = core.exportAnnotations({ useDisplayAuthor }, documentViewerKey);
    }
  }

  return annotationsPromise.then(async (xfdfString) => {
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
      (doc?.getType() === 'video' || doc?.getType() === 'audio' || doc?.getType() === 'office')
        ? filename
        : getDownloadFilename(filename, '.pdf');

    // Cloning the options object to be able to delete the customDocument property if needed.
    // doc.getFileData(options) will throw an error if this customDocument property is passed in
    const clonedOptions = Object.assign({}, options);
    if (clonedOptions.documentToBeDownloaded) {
      doc = clonedOptions.documentToBeDownloaded;
      delete clonedOptions.documentToBeDownloaded;
    }
    if (clonedOptions.store) {
      delete clonedOptions.store;
    }

    const downloadDataAsFile = (data) => {
      const arr = new Uint8Array(data);
      let file;
      let downloadType = 'application/pdf';
      if (options.downloadType === 'office') {
        const extensionToMimetype = reverseObject(window.Core.mimeTypeToExtension);
        const array = doc.getFilename().split('.');
        downloadType = extensionToMimetype[array[array.length - 1]];
      }
      if (isIE) {
        file = new Blob([arr], { type: downloadType });
      } else {
        file = new File([arr], downloadName, { type: downloadType });
      }

      saveAs(file, downloadName);
      dispatch(actions.closeElement('loadingModal'));
      fireEvent(Events.FINISHED_SAVING_PDF);
      fireEvent(Events.FILE_DOWNLOADED);
    };
    const handleError = (error) => {
      dispatch(actions.closeElement('loadingModal'));
      throw new Error(error.message);
    };

    const signatureWidgets = core.getAnnotationsList().filter((a) => a instanceof window.Annotations.SignatureWidgetAnnotation);
    const signedStatues = await Promise.all(signatureWidgets.map((a) => a.isSignedDigitally()));
    const isSignedDigitally = signedStatues.includes(true);
    if (isSignedDigitally) {
      clonedOptions.flags |= window.Core.SaveOptions.INCREMENTAL;
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
    } else if (pages && pages.length < doc.getPageCount()) {
      return doc.extractPages(pages, options.xfdfString).then(downloadDataAsFile, handleError);
    } else {
      return doc.getFileData(clonedOptions).then(downloadDataAsFile, handleError);
    }
  }).catch((error) => {
    console.warn(error);
    dispatch(actions.closeElement('loadingModal'));
  });
};

function reverseObject(obj) {
  return Object.assign({}, ...(Object.entries(obj).map(([key, value]) => ({ [value]: key }))));
}
