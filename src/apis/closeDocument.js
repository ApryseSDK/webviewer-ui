import core from 'core';
import actions from 'actions';

export default store => () => core.closeDocument().then(() => {
  store.dispatch(actions.setDocumentLoaded(false));
  store.dispatch(actions.closeElement('pageNavOverlay'));
  store.dispatch(actions.setOutlines([]));
});