import DataElements from 'constants/dataElement';

const NOTES_PANEL_CONFIG = {
  [DataElements.OFFICE_EDITOR_REVIEW_PANEL]: {
    title: 'officeEditor.reviewing',
    icon: 'ic-edit-page',
    noAnnotation: 'message.noRevisions',
    searchPlaceholder: 'message.searchSuggestionsPlaceholder',
  },
  [DataElements.OFFICE_EDITOR_COMMENT_PANEL]: {
    title: 'component.notesPanel',
    icon: 'illustration - empty state - outlines',
    noAnnotation: 'message.noAnnotations',
    searchPlaceholder: 'message.searchCommentsPlaceholder',
  },
  [DataElements.NOTES_PANEL]: {
    title: 'component.notesPanel',
    icon: 'illustration - empty state - outlines',
    noAnnotation: 'message.noAnnotations',
    searchPlaceholder: 'message.searchCommentsPlaceholder',
  },
};

const getNotesPanelConfig = (dataElement) => {
  return NOTES_PANEL_CONFIG[dataElement] || NOTES_PANEL_CONFIG[DataElements.NOTES_PANEL];
};
export default getNotesPanelConfig;
