import actions from 'actions';

/**
 * @callback CustomNoteSelectionFunction
 * @memberof WebViewerInstance
 * @param {Annotations.Annotation} annotation A reference to the annotation object associated with the note
 */

/**
 * @method WebViewerInstance#setCustomNoteSelectionFunction
 * @param {WebViewerInstance.CustomNoteSelectionFunction} customNoteSelectionFunction The function that will be invoked when clicking on a note in notes panel.
 * The function will only be invoked when the underlying annotation is not already selected.
 * @example
 WebViewer(...)
  .then(function(instance) {
    instance.setCustomNoteSelectionFunction(annotation => {
      // some code
    })
  });
 */

export default store => customNoteSelectionFunction => {
  store.dispatch(actions.setCustomNoteSelectionFunction(customNoteSelectionFunction));
};