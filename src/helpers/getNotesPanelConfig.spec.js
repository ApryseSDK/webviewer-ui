import getNotesPanelConfig from './getNotesPanelConfig';
import DataElements from 'constants/dataElement';

describe('getNotesPanelConfig tests', () => {
  it('getNotesPanelConfig should fall back to NotesPanel if dataElement is unknown', () => {
    const customElement = 'custom-panel-element';
    const fallback = getNotesPanelConfig(DataElements.NOTES_PANEL);
    const resolved = getNotesPanelConfig(customElement);
    expect(resolved).toEqual(fallback);
  });

  it('getNotesPanelConfig should return NotesPanel config when notesPanel is passed in', () => {
    const config = getNotesPanelConfig(DataElements.NOTES_PANEL);
    expect(config).toMatchObject({
      title: 'component.notesPanel',
      icon: 'illustration - empty state - outlines',
      noAnnotation: 'message.noAnnotations',
      searchPlaceholder: 'message.searchCommentsPlaceholder',
    });
  });

  it('getNotesPanelConfig should return ReviewPanel config when officeEditorReviewPanel is passed in', () => {
    const config = getNotesPanelConfig(DataElements.OFFICE_EDITOR_REVIEW_PANEL);
    expect(config).toMatchObject({
      title: 'officeEditor.reviewing',
      icon: 'ic-edit-page',
      noAnnotation: 'message.noRevisions',
      searchPlaceholder: 'message.searchSuggestionsPlaceholder',
    });
  });

  it('getNotesPanelConfig should return OECommentPanel config when officeEditorCommentPanel is passed in', () => {
    const config = getNotesPanelConfig(DataElements.OFFICE_EDITOR_COMMENT_PANEL);
    expect(config).toMatchObject({
      title: 'component.notesPanel',
      icon: 'illustration - empty state - outlines',
      noAnnotation: 'message.commentsPanelEmpty',
      searchPlaceholder: 'message.searchCommentsPlaceholder',
    });
  });

  it('getNotesPanelConfig should return SpreadsheetEditorCommentPanel config when spreadsheetEditorCommentPanel is passed in', () => {
    const config = getNotesPanelConfig(DataElements.SPREADSHEET_EDITOR_COMMENT_PANEL);
    expect(config).toMatchObject({
      title: 'component.notesPanel',
      icon: 'illustration - empty state - outlines',
      noAnnotation: 'message.commentsPanelEmpty',
      searchPlaceholder: 'message.searchCommentsPlaceholder',
    });
  });
});
