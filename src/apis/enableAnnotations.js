/**
 * Enables annotations feature, affecting the annotation visibility and elements related to annotations.
 * @method WebViewer#enableAnnotations
 * @example // enable annotations feature
viewerElement.addEventListener('ready', () => {
  const instance = viewer.getInstance();
  instance.enableAnnotations();
});
 */

import core from 'core';
import disableAnnotations from './disableAnnotations';
import getAnnotationRelatedElements from 'helpers/getAnnotationRelatedElements';
import { PRIORITY_ONE } from 'constants/actionPriority';
import actions from 'actions';
import selectors from 'selectors';

export default store => (enable = true) =>  {
  let elements = [
    'notesPanel',
    'notesPanelButton',
    ...getAnnotationRelatedElements(store.getState())
  ];

  if (enable) {
    if (!core.isCreateRedactionEnabled()) {
      elements = elements.filter(ele => ele !== 'redactionButton');
    }
    const annotationToolNames = selectors.getAnnotationToolNames(store.getState());
    annotationToolNames.forEach(toolName => {
      core.getTool(toolName).disabled = false;
    });

    store.dispatch(actions.enableElements(elements, PRIORITY_ONE));
    core.showAnnotations(core.getAnnotationsList());
  } else {
    console.warn('enableAnnotations(false) is deprecated, please use disableAnnotations() instead');
    disableAnnotations(store)();
  }
};
