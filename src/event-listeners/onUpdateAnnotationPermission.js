import core from 'core';
import actions from 'actions';
import getAnnotationRelatedElements from 'helpers/getAnnotationRelatedElements';

export default ({ dispatch, getState }) => () => {
  const isReadOnly = core.getIsReadOnly();
  const elements = [
    'annotationPopup',
    ...getAnnotationRelatedElements(getState()),
  ];

  if (isReadOnly) {
    dispatch(actions.disableElements(elements));
    core.setToolMode('AnnotationEdit');
  } else {
    dispatch(actions.enableElements(elements));
  }
  
  dispatch(actions.setReadOnly(core.getIsReadOnly()));
  dispatch(actions.setAdminUser(core.getIsAdminUser()));
  dispatch(actions.setUserName(core.getCurrentUser()));
  core.drawAnnotationsFromList(core.getSelectedAnnotations());
};