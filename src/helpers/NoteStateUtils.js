import i18next from 'i18next';
import core from 'core';

function createStateAnnotation(annotation, state) {
  // TODO: the code below is copied from annotManager.updateAnnotationState in WebViewer to work around the issue
  // in https://github.com/PDFTron/webviewer-ui/issues/620
  // the implement before wasn't causing any actual issues, but it was confusing and unnecessary to trigger two annotationChanged events when a status is set
  // A proper fix should be done once https://trello.com/c/zWlkygNb/1023-consider-adding-a-setlocalizationhandler-to-corecontrols is implemented
  // at that time, we could use the translation handler(t) internally in updateAnnotationState before setting the contents, and use that function instead in this component

  const stateAnnotation = new Annotations.StickyAnnotation();

  stateAnnotation['InReplyTo'] = annotation['Id'];
  stateAnnotation['X'] = annotation['X'];
  stateAnnotation['Y'] = annotation['Y'];
  stateAnnotation['PageNumber'] = annotation['PageNumber'];
  stateAnnotation['Subject'] = 'Sticky Note';
  stateAnnotation['Author'] = core.getCurrentUser();
  stateAnnotation['State'] = state;
  stateAnnotation['StateModel'] = state === 'Marked' || state === 'Unmarked' ? 'Marked' : 'Review';
  stateAnnotation['Hidden'] = true;

  const displayAuthor = core.getDisplayAuthor(stateAnnotation['Author']);
  const stateMessage = i18next.t(`option.state.${state.toLowerCase()}`);
  const contents = `${stateMessage} ${i18next.t('option.state.setBy')} ${displayAuthor}`;
  stateAnnotation.setContents(contents);

  return stateAnnotation;
}

export {
  createStateAnnotation,
};