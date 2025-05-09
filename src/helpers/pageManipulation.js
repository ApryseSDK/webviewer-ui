import core from 'core';
import actions from 'actions';
import extractPagesWithAnnotations from './extractPagesWithAnnotations';
import fireEvent from './fireEvent';
import Events from 'constants/events';
import DataElements from 'src/constants/dataElement';

export const extractPagesToMerge = (pageNumbers) => {
  // extract pages and put the data on the iFrame window element for another instance of WebViewer to access
  window.extractedDataPromise = extractPagesWithAnnotations(pageNumbers);
  window.pagesExtracted = pageNumbers;
};

export const mergeDocument = (srcToMerge, mergeToPage, shouldFireEvent = true) => (dispatch) => {
  dispatch(actions.openElement(DataElements.LOADING_MODAL));

  return new Promise((resolve, reject) => {
    core.mergeDocument(srcToMerge, mergeToPage).then((mergeResults) => {
      dispatch(actions.closeElement(DataElements.LOADING_MODAL));
      core.setCurrentPage(mergeToPage);

      if (shouldFireEvent) {
        fireEvent(Events.DOCUMENT_MERGED, mergeResults);
      }

      resolve(mergeResults);
    }).catch((err) => {
      reject(err);
      dispatch(actions.closeElement(DataElements.LOADING_MODAL));
    });
  });
};

export const mergeExternalWebViewerDocument = (viewerID, mergeToPage) => (dispatch) => {
  return new Promise((resolve, reject) => {
    const otherWebViewerIframe = window.parent.document.querySelector(`#${viewerID}`);
    if (!otherWebViewerIframe) {
      console.warn('Could not find other instance of WebViewer');
      reject();
    }

    let contentWindow = otherWebViewerIframe.contentWindow;
    if (window.isApryseWebViewerWebComponent) {
      contentWindow = window;
    }

    const extractedDataPromise = contentWindow.extractedDataPromise;
    if (!extractedDataPromise) {
      console.warn('Could not retrieve data from other instance of WebViewer');
      reject();
    }

    dispatch(actions.openElement(DataElements.LOADING_MODAL));
    extractedDataPromise.then((docToMerge) => {
      dispatch(mergeDocument(docToMerge, mergeToPage, false)).then(({ filename, pages }) => {
        fireEvent(Events.DOCUMENT_MERGED, { filename, pages: contentWindow.pagesExtracted });
        dispatch(actions.closeElement(DataElements.LOADING_MODAL));
        resolve({ filename, pages });
      });
    }).catch((err) => {
      dispatch(actions.closeElement(DataElements.LOADING_MODAL));
      reject(err);
    });
  });
};