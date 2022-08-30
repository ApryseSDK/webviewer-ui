import actions from 'actions';

/**
 * @callback CustomNoteSelectionFunction
 * @memberof UI
 * @param {Core.Annotations.Annotation} annotation A reference to the annotation object associated with the note
 */

/**
 * @method UI.setCustomNoteSelectionFunction
 * @param {UI.CustomNoteSelectionFunction} customNoteSelectionFunction The function that will be invoked when clicking on a note in notes panel.
 * The function will only be invoked when the underlying annotation is not already selected.
 * @example
 WebViewer(...)
  .then(function(instance) {
    instance.UI.setCustomNoteSelectionFunction(annotation => {
      // some code
    })
  });
 */

export default (store) => (customNoteSelectionFunction) => {
  store.dispatch(actions.setCustomNoteSelectionFunction(customNoteSelectionFunction));
};