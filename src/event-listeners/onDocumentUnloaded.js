import actions from 'actions';

export default dispatch => () => {
  dispatch(actions.setDocumentLoaded(false));
  dispatch(actions.closeElements([ 'pageNavOverlay', 'searchOverlay' ]));
  dispatch(actions.setOutlines([]));
  dispatch(actions.setTotalPages(0));
};