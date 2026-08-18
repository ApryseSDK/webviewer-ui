import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Note from './Note';
import NoteContext from './Context';

const mockDispatch = jest.fn();
let mockNoteTransformFunction = null;
let mockCustomNoteSelectionFunction = null;
let mockCanModify = true;
let mockCanModifyContents = true;
let mockIsOfficeEditorMode = false;
let mockIsSpreadsheetEditorMode = false;
let mockOfficeEditorCommentId = null;
const mockMoveCursorToTrackedChange = jest.fn();
const mockMoveCursorToComment = jest.fn();
const mockSelectAnnotation = jest.fn();
const mockJumpToAnnotation = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: () => [(key) => key],
}));

jest.mock('hooks/useCore', () => () => ({
  core: {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    getGroupAnnotations: jest.fn(() => []),
    deselectAllAnnotations: jest.fn(),
    canModify: jest.fn(() => mockCanModify),
    canModifyContents: jest.fn(() => mockCanModifyContents),
    selectAnnotation: (...args) => mockSelectAnnotation(...args),
    jumpToAnnotation: (...args) => mockJumpToAnnotation(...args),
    getOfficeEditor: () => ({
      getCommentManager: () => ({
        moveCursorToComment: (...args) => mockMoveCursorToComment(...args),
      }),
    }),
    getAnnotationManager: () => ({
      selectAnnotation: jest.fn(),
      selectAnnotations: jest.fn(),
    }),
  },
}));

jest.mock('react-redux', () => {
  const actual = jest.requireActual('react-redux');
  return {
    ...actual,
    useDispatch: () => mockDispatch,
    useSelector: (selector) => selector({}),
  };
});

jest.mock('selectors', () => ({
  getNoteTransformFunction: () => mockNoteTransformFunction,
  getCustomNoteSelectionFunction: () => mockCustomNoteSelectionFunction,
  getUnreadAnnotationIdSet: () => new Set(),
  isCommentThreadExpansionEnabled: () => false,
  isRightClickAnnotationPopupEnabled: () => true,
  getActiveDocumentViewerKey: () => 1,
  getIsOfficeEditorMode: () => mockIsOfficeEditorMode,
  getOfficeEditorEditMode: () => 'editing',
  isSpreadsheetEditorModeEnabled: () => mockIsSpreadsheetEditorMode,
}));

jest.mock('components/NoteContent', () => {
  return function MockNoteContent({ annotation, editingKey, isEditing, setIsEditing }) {
    return (
      <button
        aria-label={`note-content ${annotation.Id}`}
        aria-pressed={Boolean(isEditing)}
        onClick={() => setIsEditing(true, editingKey)}
      >
        {annotation.Id}
      </button>
    );
  };
});

jest.mock('components/Note/ReplyArea', () => {
  return function MockReplyArea() {
    return <div aria-label="reply-area" />;
  };
});

jest.mock('components/Button', () => {
  return function MockButton({ onClick, dataElement, className, label }) {
    return (
      <button
        aria-label={label || dataElement}
        data-element={dataElement}
        className={className}
        onClick={onClick}
      >
        {label}
      </button>
    );
  };
});

jest.mock('src/helpers/isAnnotationRenderedInDisplayMode', () => ({
  isAnnotationRenderedInDisplayMode: () => true,
}));

jest.mock('helpers/officeEditorCommentHelper', () => ({
  getOfficeEditorCommentId: () => mockOfficeEditorCommentId,
}));

const createReply = (id, createdAt) => ({
  Id: id,
  DateCreated: createdAt,
  isReply: () => true,
  getCustomData: () => null,
  getAttachments: () => [],
  getContents: () => `Reply ${id}`,
  getRichTextStyle: () => ({}),
});

const createAnnotation = (getReplies) => ({
  Id: 'note-1',
  PageNumber: 1,
  Author: 'test-author',
  DateCreated: 0,
  getReplies,
  getContents: () => 'Top note',
  getCustomData: () => null,
  getAttachments: () => [],
  getRichTextStyle: () => ({}),
  getStatus: () => '',
  isReply: () => false,
  getAssociatedNumber: () => 1,
});

const baseContext = {
  isSelected: true,
  resize: jest.fn(),
  pendingEditTextMap: {},
  isContentEditable: true,
  isDocumentReadOnly: false,
  isExpandedFromSearch: false,
  setCurAnnotId: jest.fn(),
};

describe('Note', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
    mockMoveCursorToTrackedChange.mockClear();
    mockMoveCursorToComment.mockClear();
    mockSelectAnnotation.mockClear();
    mockJumpToAnnotation.mockClear();
    mockNoteTransformFunction = null;
    mockCustomNoteSelectionFunction = null;
    mockCanModify = true;
    mockCanModifyContents = true;
    mockIsOfficeEditorMode = false;
    mockIsSpreadsheetEditorMode = false;
    mockOfficeEditorCommentId = null;
  });

  it('should show the spreadsheet sheet and cell location for SSE comments', () => {
    mockIsSpreadsheetEditorMode = true;

    const annotation = {
      ...createAnnotation(() => []),
      getCustomData: (key) => {
        if (key === 'spreadsheetThreadId') {
          return 'thread-1';
        }

        if (key === 'spreadsheetSheetName') {
          return 'Sheet 1';
        }

        if (key === 'spreadsheetCell') {
          return 'B4';
        }

        return null;
      },
    };

    render(
      <NoteContext.Provider value={baseContext}>
        <Note
          annotation={annotation}
          isMultiSelected={false}
          isMultiSelectMode={false}
          isInNotesPanel={false}
          isCustomPanelOpen={false}
          shouldHideConnectorLine
          handleMultiSelect={jest.fn()}
        />
      </NoteContext.Provider>
    );

    expect(screen.getByText('Sheet 1 | B4')).toBeInTheDocument();
  });

  it('should trigger custom note selection when note container is clicked', async () => {
    const annotation = createAnnotation(() => []);
    const onCustomNoteSelect = jest.fn();
    mockCustomNoteSelectionFunction = onCustomNoteSelect;

    render(
      <NoteContext.Provider value={{ ...baseContext, isSelected: false }}>
        <Note
          annotation={annotation}
          isMultiSelected={false}
          isMultiSelectMode={false}
          isInNotesPanel={false}
          isCustomPanelOpen={false}
          shouldHideConnectorLine
          handleMultiSelect={jest.fn()}
        />
      </NoteContext.Provider>
    );

    const expandNoteButton = screen.getByRole('button', { name: 'expandNoteButton' });
    const noteContainer = expandNoteButton.parentElement;
    expect(noteContainer).not.toBeNull();
    await userEvent.click(noteContainer);
    expect(onCustomNoteSelect).toHaveBeenCalledWith(annotation);
  });

  it('should not trigger custom note selection when clicking an interactive descendant', async () => {
    const annotation = createAnnotation(() => []);
    const onCustomNoteSelect = jest.fn();
    mockCustomNoteSelectionFunction = onCustomNoteSelect;

    render(
      <NoteContext.Provider value={{ ...baseContext, isSelected: false }}>
        <Note
          annotation={annotation}
          isMultiSelected={false}
          isMultiSelectMode={false}
          isInNotesPanel={false}
          isCustomPanelOpen={false}
          shouldHideConnectorLine
          handleMultiSelect={jest.fn()}
        />
      </NoteContext.Provider>
    );

    await userEvent.click(screen.getByRole('button', { name: 'note-content note-1' }));
    expect(onCustomNoteSelect).not.toHaveBeenCalled();
  });

  it('should not bubble click events to parent when clicking the note container', async () => {
    const annotation = createAnnotation(() => []);
    const onParentClick = jest.fn();

    render(
      <div onClick={onParentClick}>
        <NoteContext.Provider value={{ ...baseContext, isSelected: false }}>
          <Note
            annotation={annotation}
            isMultiSelected={false}
            isMultiSelectMode={false}
            isInNotesPanel={false}
            isCustomPanelOpen={false}
            shouldHideConnectorLine
            handleMultiSelect={jest.fn()}
          />
        </NoteContext.Provider>
      </div>
    );

    const expandNoteButton = screen.getByRole('button', { name: 'expandNoteButton' });
    const noteContainer = expandNoteButton.parentElement;
    expect(noteContainer).not.toBeNull();
    await userEvent.click(noteContainer);

    expect(onParentClick).not.toHaveBeenCalled();
  });

  it('should not bubble click events to parent when clicking an interactive descendant', async () => {
    const annotation = createAnnotation(() => []);
    const onParentClick = jest.fn();

    render(
      <div onClick={onParentClick}>
        <NoteContext.Provider value={{ ...baseContext, isSelected: false }}>
          <Note
            annotation={annotation}
            isMultiSelected={false}
            isMultiSelectMode={false}
            isInNotesPanel={false}
            isCustomPanelOpen={false}
            shouldHideConnectorLine
            handleMultiSelect={jest.fn()}
          />
        </NoteContext.Provider>
      </div>
    );

    await userEvent.click(screen.getByRole('button', { name: 'note-content note-1' }));

    expect(onParentClick).not.toHaveBeenCalled();
  });

  it('should be able to edit reply after a reply above is deleted', async () => {
    const reply1 = createReply('reply-1', 1);
    const reply2 = createReply('reply-2', 2);
    const reply3 = createReply('reply-3', 3);

    let currentReplies = [reply1, reply2, reply3];
    const annotation = createAnnotation(() => currentReplies);

    const props = {
      annotation,
      isMultiSelected: false,
      isMultiSelectMode: false,
      isInNotesPanel: false,
      isCustomPanelOpen: false,
      shouldHideConnectorLine: true,
      handleMultiSelect: jest.fn(),
    };

    const { rerender } = render(
      <NoteContext.Provider value={baseContext}>
        <Note {...props} />
      </NoteContext.Provider>
    );

    // Enter reply edit mode on the lower reply
    await userEvent.click(screen.getByRole('button', { name: 'note-content reply-3' }));
    expect(screen.getByRole('button', { name: 'note-content reply-3' })).toHaveAttribute('aria-pressed', 'true');

    // Simulate deleting a reply above it and rerender thread
    currentReplies = [reply2, reply3];
    rerender(
      <NoteContext.Provider value={baseContext}>
        <Note {...props} />
      </NoteContext.Provider>
    );

    // The lower reply should still be in editing state after indices shift.
    expect(screen.getByRole('button', { name: 'note-content reply-3' })).toHaveAttribute('aria-pressed', 'true');
  });
});
