import disableDownload from './disableDownload';
import { PRIORITY_ONE } from 'constants/actionPriority';
import actions from 'actions';

export default store => (enable = true) =>  {
  if (enable) {
    store.dispatch(actions.enableElement('downloadButton', PRIORITY_ONE));
  } else {
    console.warn('enableDownload(false) is deprecated, please use disableDownload() instead');
    disableDownload(store)();
  }
};
