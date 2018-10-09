import actions from 'actions';

export default dispatch => (e, pageNumber) => {
  dispatch(actions.setCurrentPage(pageNumber));
  $(document).trigger('pageChanged');
};