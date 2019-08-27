/**
 * Enables annotations feature, affecting the annotation visibility and elements related to annotations.
 * @method WebViewer#enableAnnotations
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    instance.enableAnnotations();
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  instance.enableAnnotations();
});
 */

import core from 'core';

import actions from 'actions';
import getAnnotationRelatedElements from 'helpers/getAnnotationRelatedElements';
import { PRIORITY_ONE } from 'constants/actionPriority';
import { getAnnotationCreateToolNames } from 'constants/map';

import disableAnnotations from './disableAnnotations';

export default store => (enable = true) => {
  const elements = [
    'notesPanel',
    'notesPanelButton',
    ...getAnnotationRelatedElements(store.getState()),
  ];

  if (enable) {
    getAnnotationCreateToolNames().forEach(toolName => {
      core.getTool(toolName).disabled = false;
    });

    store.dispatch(actions.enableElements(elements, PRIORITY_ONE));
    core.showAnnotations(core.getAnnotationsList());
  } else {
    console.warn('enableAnnotations(false) is deprecated, please use disableAnnotations() instead');
    disableAnnotations(store)();
  }
};
