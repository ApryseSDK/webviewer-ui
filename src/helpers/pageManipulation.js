import core from 'core';
import actions from 'actions';
import extractPagesWithAnnotations from './extractPagesWithAnnotations';

export const extractPagesToMerge = pageNumbers => {
  window.extractedDataPromise = extractPagesWithAnnotations(pageNumbers);
};

export const mergeDocument =  (srcToMerge, mergeToPage) => dispatch => {
  dispatch(actions.openElement('loadingModal'));

  return new Promise((resolve, reject) => {
    core.mergeDocument(srcToMerge, mergeToPage).then(() => {
      dispatch(actions.closeElement('loadingModal'));
      core.setCurrentPage(mergeToPage);
      resolve();
    }).catch(err => {
      reject(err);
      dispatch(actions.closeElement('loadingModal'));
    });
  });
}

export const mergeExternalWebViewerDocument =  (viewerID, mergeToPage) => dispatch => {
  dispatch(actions.openElement('loadingModal'));

  return new Promise((resolve, reject) => {
    const otherWebViewerIframe = window.parent.document.querySelector(`#${viewerID}`);
    if (!otherWebViewerIframe) {
      console.warn('Could not find other instance of WebViewer');
      reject();
    }
  
    const extractedDataPromise = otherWebViewerIframe.contentWindow.extractedDataPromise;
    if (!extractedDataPromise) {
      console.warn('Could not retreive information from other instance of WebViewer');
      reject();
    }
  
    return extractedDataPromise.then(docToMerge => {
      return dispatch(mergeDocument(docToMerge, mergeToPage));
    });
  });
}