import * as eventListeners from 'src/event-listeners';
import core from 'core';

export default store => {
  const { dispatch } = store;
  const onBeforeDocumentLoaded = eventListeners.onBeforeDocumentLoaded(dispatch);
  const onDisplayModeUpdated = eventListeners.onDisplayModeUpdated(dispatch);
  const onDocumentLoaded = eventListeners.onDocumentLoaded(dispatch);
  const onDocumentUnloaded = eventListeners.onDocumentUnloaded(dispatch);
  const onFitModeUpdated = eventListeners.onFitModeUpdated(dispatch);
  const onRotationUpdated = eventListeners.onRotationUpdated(dispatch);
  const onToolUpdated = eventListeners.onToolUpdated(dispatch);
  const onToolModeUpdated = eventListeners.onToolModeUpdated(dispatch);
  const onZoomUpdated = eventListeners.onZoomUpdated(dispatch);
  const onPageNumberUpdated = eventListeners.onPageNumberUpdated(dispatch);
  const onUpdateAnnotationPermission = eventListeners.onUpdateAnnotationPermission(store);
  const onAnnotationSelected = eventListeners.onAnnotationSelected(dispatch);
  const onStampAnnotationAdded = eventListeners.onStampAnnotationAdded(dispatch);
  const onStickyAnnotationAdded = eventListeners.onStickyAnnotationAdded(store);
  const onKeyDown = eventListeners.onKeyDown(dispatch);
  const onFullScreenChange = eventListeners.onFullScreenChange(dispatch);
  const onLayoutChanged = eventListeners.onLayoutChanged(dispatch); 

  return {
    addEventHandlers: () => {
      core.addEventListener('beforeDocumentLoaded', onBeforeDocumentLoaded);
      core.addEventListener('displayModeUpdated', onDisplayModeUpdated);
      core.addEventListener('documentLoaded', onDocumentLoaded);
      core.addEventListener('documentUnloaded', onDocumentUnloaded);
      core.addEventListener('fitModeUpdated', onFitModeUpdated);
      core.addEventListener('rotationUpdated', onRotationUpdated);
      core.addEventListener('toolUpdated', onToolUpdated);
      core.addEventListener('toolModeUpdated', onToolModeUpdated);
      core.addEventListener('zoomUpdated', onZoomUpdated);
      core.addEventListener('pageNumberUpdated', onPageNumberUpdated);
      core.addEventListener('layoutChanged', onLayoutChanged);
      core.addEventListener('updateAnnotationPermission', onUpdateAnnotationPermission);
      core.addEventListener('annotationSelected', onAnnotationSelected);
      core.getTool('AnnotationCreateStamp').on('annotationAdded', onStampAnnotationAdded);
      core.getTool('AnnotationCreateSticky').on('annotationAdded', onStickyAnnotationAdded);
      document.addEventListener('keydown', onKeyDown);
      document.addEventListener('fullscreenchange', onFullScreenChange);
      document.addEventListener('mozfullscreenchange', onFullScreenChange);
      document.addEventListener('webkitfullscreenchange', onFullScreenChange);
    },
    removeEventHandlers: () => {
      core.removeEventListener('beforeDocumentLoaded', onBeforeDocumentLoaded);
      core.removeEventListener('displayModeUpdated', onDisplayModeUpdated);
      core.removeEventListener('documentLoaded', onDocumentLoaded);
      core.removeEventListener('documentUnloaded', onDocumentUnloaded);
      core.removeEventListener('fitModeUpdated', onFitModeUpdated);
      core.removeEventListener('rotationUpdated', onRotationUpdated);
      core.removeEventListener('toolUpdated', onToolUpdated);
      core.removeEventListener('toolModeUpdated', onToolModeUpdated);
      core.removeEventListener('zoomUpdated', onZoomUpdated);
      core.removeEventListener('pageNumberUpdated', onPageNumberUpdated);
      core.removeEventListener('layoutChanged', onLayoutChanged);
      core.removeEventListener('updateAnnotationPermission', onUpdateAnnotationPermission);
      core.removeEventListener('annotationSelected', onAnnotationSelected);
      core.getTool('AnnotationCreateStamp').off('annotationAdded', onStampAnnotationAdded);
      core.getTool('AnnotationCreateSticky').off('annotationAdded', onStickyAnnotationAdded);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('fullscreenchange', onFullScreenChange);
      document.removeEventListener('mozfullscreenchange', onFullScreenChange);
      document.removeEventListener('webkitfullscreenchange', onFullScreenChange);
    }
  };
};