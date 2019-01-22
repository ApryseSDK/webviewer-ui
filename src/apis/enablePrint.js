import disablePrint from './disablePrint';
import { PRIORITY_ONE } from 'constants/actionPriority';
import actions from 'actions';

export default store => (enable = true) => {
  const elements = [
    'printButton',
    'printModal'
  ];

  if (enable) {
    store.dispatch(actions.enableElements(elements, PRIORITY_ONE));
  } else {
    console.warn('enablePrint(false) is deprecated, please use disablePrint() instead');
    disablePrint(store)();
  }
};
