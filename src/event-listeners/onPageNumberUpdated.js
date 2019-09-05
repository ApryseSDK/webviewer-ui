import actions from 'actions';
import fireEvent from 'helpers/fireEvent';

export default dispatch => pageNumber => {
  dispatch(actions.setCurrentPage(pageNumber));

  fireEvent('pageChanged', [pageNumber]);
};