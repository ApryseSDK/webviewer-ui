import actions from 'actions';

export default dispatch => () => {
  dispatch(actions.setDocumentLoaded(false));
  dispatch(actions.closeElement('pageNavOverlay'));
  dispatch(actions.setOutlines([]));
  dispatch(actions.setTotalPages(0));
};