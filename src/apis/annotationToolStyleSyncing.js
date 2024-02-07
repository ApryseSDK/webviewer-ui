import actions from 'actions';

/**
 * Enables syncing of annotation style updates to the associated tool that created the annotation.
 * Note that this is disabled by default.
 * @method UI.enableAnnotationToolStyleSyncing
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.enableAnnotationToolStyleSyncing();
  });
 */
export const enableAnnotationToolStyleSyncing = (store) => () => {
  store.dispatch(actions.setAnnotationToolStyleSyncingEnabled(true));
  store.dispatch(actions.setToolDefaultStyleUpdateFromAnnotationPopupEnabled(true));
};

/**
 * Disables syncing of annotation style updates to the associated tool that created the annotation.
 * So if an annotation's style is changed the tool default styles will not be updated.
 * @method UI.disableAnnotationToolStyleSyncing
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.disableAnnotationToolStyleSyncing();
  });
 */
export const disableAnnotationToolStyleSyncing = (store) => () => {
  store.dispatch(actions.setAnnotationToolStyleSyncingEnabled(false));
  store.dispatch(actions.setToolDefaultStyleUpdateFromAnnotationPopupEnabled(false));
};

