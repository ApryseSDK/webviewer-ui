import actions from 'actions';
import extractPagesWithAnnotations from './extractPagesWithAnnotations';
import fireEvent from './fireEvent';
import Events from 'constants/events';
import DataElements from 'src/constants/dataElement';
import { getInstanceCore } from 'hooks/useCore/useCore';

export const extractPagesToMerge = (pageNumbers, documentViewerKey = 1) => {
  // extract pages and put the data on the iFrame window element for another instance of WebViewer to access
  window.extractedDataPromise = extractPagesWithAnnotations(pageNumbers, documentViewerKey);
  window.pagesExtracted = pageNumbers;
};

export const mergeDocument = (srcToMerge, mergeToPage, shouldFireEvent = true, documentViewerKey = 1) => (dispatch, getState) => {
  const { instanceId } = getState().viewer;
  const core = getInstanceCore(instanceId);
  dispatch(actions.openElement(DataElements.LOADING_MODAL));

  return new Promise((resolve, reject) => {
    core.mergeDocument(srcToMerge, mergeToPage, documentViewerKey).then((mergeResults) => {
      dispatch(actions.closeElement(DataElements.LOADING_MODAL));
      core.setCurrentPage(mergeToPage, documentViewerKey);

      if (shouldFireEvent) {
        void fireEvent(Events.DOCUMENT_MERGED, [mergeResults.filename, mergeResults.pages], null, instanceId);
      }

      resolve(mergeResults);
    }).catch((err) => {
      reject(err);
      dispatch(actions.closeElement(DataElements.LOADING_MODAL));
    });
  });
};

export const mergeExternalWebViewerDocument = (viewerID, mergeToPage, documentViewerKey = 1) => (dispatch, getState) => {
  const { instanceId } = getState().viewer;
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
      dispatch(mergeDocument(docToMerge, mergeToPage, false, documentViewerKey)).then(({ filename, pages }) => {
        void fireEvent(Events.DOCUMENT_MERGED, [filename, contentWindow.pagesExtracted], null, instanceId);
        dispatch(actions.closeElement(DataElements.LOADING_MODAL));
        resolve({ filename, pages });
      });
    }).catch((err) => {
      dispatch(actions.closeElement(DataElements.LOADING_MODAL));
      reject(err);
    });
  });
};