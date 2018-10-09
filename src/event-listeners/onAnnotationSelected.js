import actions from 'actions';

export default dispatch => (e, annotationList, action) => {
  if (action === 'deselected') {
    // AnnotationManager.js line 1150
    // Annotation will be deselected after it's been deleted.
    // However, we don't want to collapse the note if we deleted a reply
    if (annotationList && annotationList[0].InReplyTo) {
      return;
    }
    dispatch(actions.collapseAllNotes());
    dispatch(actions.setIsNoteEditing(false));
  } else if (action === 'selected') {
    const ids = [];
    
    annotationList.forEach(annotation => {
      ids.push(annotation.Id);
    });
    dispatch(actions.expandNotes(ids));
  }
};
