/**
 * https://www.pdftron.com/api/web/CoreControls.Document.html#mergeDocument__anchor
 */
import actions from 'actions';

export default (dispatch, documentToMerge, position) => {
  dispatch(actions.openElement('loadingModal'));
  return window.docViewer.getDocument().mergeDocument(documentToMerge, position)
    .then(() => {
      dispatch(actions.closeElement('loadingModal'));
    })
    .catch(() => {
      dispatch(actions.closeElement('loadingModal'));
    });
};
