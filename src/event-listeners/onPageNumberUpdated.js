import actions from 'actions';

export default (dispatch, documentViewerKey) => (pageNumber) => {
  dispatch(actions.setCurrentPage(pageNumber, documentViewerKey));
};