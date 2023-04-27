import actions from 'actions';

/**
 * Enables syncing of annotation style updates to the associated tool that created the annotation.
 * Note that this is enabled by default.
 * @method UI.enableToolDefaultStyleUpdateFromAnnotationPopup
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.enableToolDefaultStyleUpdateFromAnnotationPopup();
  });
 */
export const enableToolDefaultStyleUpdateFromAnnotationPopup = (store) => () => {
  store.dispatch(actions.setToolDefaultStyleUpdateFromAnnotationPopupEnabled(true));
};

/**
 * Disables syncing of annotation style updates to the associated tool that created the annotation.
 * So if an annotation's style is changed the tool default styles will not be updated.
 * @method UI.disableToolDefaultStyleUpdateFromAnnotationPopup
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.disableToolDefaultStyleUpdateFromAnnotationPopup();
  });
 */
export const disableToolDefaultStyleUpdateFromAnnotationPopup = (store) => () => {
  store.dispatch(actions.setToolDefaultStyleUpdateFromAnnotationPopupEnabled(false));
};
