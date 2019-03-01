import actions from 'actions';
import core from 'core';

export default store => (enable = true) =>  {

  if (enable) {
    store.dispatch(actions.enableElement('redactionButton', 1));
    core.enableRedaction(true);

    if (!core.isFullPDFEnabled()) {
      console.warn('Full api is not enabled, applying redactions is disabled');
    }
  } else {
    store.dispatch(actions.disableElement('redactionButton', 1));
    core.enableRedaction(false);
  }
};
