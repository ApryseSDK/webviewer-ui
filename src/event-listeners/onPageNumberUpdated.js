import actions from 'actions';

export default dispatch => pageNumber => {
  dispatch(actions.setCurrentPage(pageNumber));
};