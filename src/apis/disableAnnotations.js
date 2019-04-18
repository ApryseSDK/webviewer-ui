/**
 * Disables annotations feature, affecting the annotation visibility and elements related to annotations.
 * @method WebViewer#disableAnnotations
 * @example const viewerElement = document.getElementById('viewer');
const instance = await WebViewer({ ... }, viewerElement);

instance.disableAnnotations();
 */

import core from 'core';
import getAnnotationRelatedElements from 'helpers/getAnnotationRelatedElements';
import { PRIORITY_ONE } from 'constants/actionPriority';
import { getAnnotationCreateToolNames } from 'constants/map';
import actions from 'actions';

export default store => () => {
  const elements = [
    'notesPanel',
    'notesPanelButton',
    ...getAnnotationRelatedElements(store.getState())
  ];

  getAnnotationCreateToolNames().forEach(toolName => {
    core.getTool(toolName).disabled = true;
  });
  store.dispatch(actions.disableElements(elements, PRIORITY_ONE));
  core.hideAnnotations(core.getAnnotationsList());
};
