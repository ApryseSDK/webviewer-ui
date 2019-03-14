import { PRIORITY_ONE } from 'constants/actionPriority';
import actions from 'actions';
import core from 'core';

export default store => () => {
  store.dispatch(actions.disableElements([ 'measurementToolGroupButton', 'measurementOverlay' ], PRIORITY_ONE));
  core.setToolMode('AnnotationEdit');
};