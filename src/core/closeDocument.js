import actions from 'actions';

/**
 * https://www.pdftron.com/api/web/CoreControls.DocumentViewer.html#closeDocument__anchor
 * @fires documentUnloaded on DocumentViewer
 * @see onDocumentUnloaded.js (No documentation yet)
 */
export default dispatch => {
  dispatch(actions.closeElement('passwordModal'));

  return window.docViewer.closeDocument();
};
