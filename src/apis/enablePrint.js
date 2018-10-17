import { LOW_PRIORITY } from 'constants/actionPriority';
import actions from 'actions';

export default store => (enable = true) => {
  const elements = [
    'printButton',
    'printModal'
  ];

  if (enable) {
    store.dispatch(actions.enableElements(elements, LOW_PRIORITY));
  } else {
    store.dispatch(actions.disableElements(elements, LOW_PRIORITY));
  }
};
