// this property does not have to do with rendering so it doesn't need to be in redux
let toolDefaultStyleUpdateFromAnnotationPopupEnabled = true;

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
export function enableToolDefaultStyleUpdateFromAnnotationPopup() {
  toolDefaultStyleUpdateFromAnnotationPopupEnabled = true;
}

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
export function disableToolDefaultStyleUpdateFromAnnotationPopup() {
  toolDefaultStyleUpdateFromAnnotationPopupEnabled = false;
}

export function isToolDefaultStyleUpdateFromAnnotationPopupEnabled() {
  return toolDefaultStyleUpdateFromAnnotationPopupEnabled;
}