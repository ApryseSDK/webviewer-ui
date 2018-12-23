import { PRIORITY_ONE } from 'constants/actionPriority';
import actions from 'actions';

export default store => () => {
  const elements = [
    'printButton',
    'printModal'
  ];

  store.dispatch(actions.disableElements(elements, PRIORITY_ONE));
};
