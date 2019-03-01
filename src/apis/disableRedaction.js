import actions from 'actions';
import core from 'core';

export default store => () => {
  store.dispatch(actions.disableElement('redactionButton', 1));
  core.enableRedaction(false);
  core.setToolMode('AnnotationEdit');
};
