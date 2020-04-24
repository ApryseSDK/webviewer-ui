import core from 'core';
import actions from 'actions';
import extractPagesWithAnnotations from './extractPagesWithAnnotations';

export const extractPagesToMerge = pageNumbers => {
  // extract pages and put the data on the iFrame window element for another instance of WebViewer to access
  window.extractedDataPromise = extractPagesWithAnnotations(pageNumbers);
};

export const mergeDocument = (srcToMerge, mergeToPage) => dispatch => {
  dispatch(actions.openElement('loadingModal'));

  return new Promise((resolve, reject) => {
    core.mergeDocument(srcToMerge, mergeToPage).then(pageInserted => {
      dispatch(actions.closeElement('loadingModal'));
      core.setCurrentPage(mergeToPage);
      resolve(pageInserted);
    }).catch(err => {
      reject(err);
      dispatch(actions.closeElement('loadingModal'));
    });
  });
};

export const mergeExternalWebViewerDocument = (viewerID, mergeToPage) => dispatch => {
  return new Promise((resolve, reject) => {
    const otherWebViewerIframe = window.parent.document.querySelector(`#${viewerID}`);
    if (!otherWebViewerIframe) {
      console.warn('Could not find other instance of WebViewer');
      reject();
    }

    const extractedDataPromise = otherWebViewerIframe.contentWindow.extractedDataPromise;
    if (!extractedDataPromise) {
      console.warn('Could not retrieve data from other instance of WebViewer');
      reject();
    }

    dispatch(actions.openElement('loadingModal'));
    extractedDataPromise.then(docToMerge => {
      dispatch(mergeDocument(docToMerge, mergeToPage)).then(pageInserted => {
        dispatch(actions.closeElement('loadingModal'));
        resolve(pageInserted);
      });
    }).catch(err => {
      dispatch(actions.closeElement('loadingModal'));
      reject(err);
    });
  });
};