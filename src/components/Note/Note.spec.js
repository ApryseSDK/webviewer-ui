import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Note from './Note';
import NoteContext from './Context';

const mockDispatch = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: () => [(key) => key],
}));

jest.mock('hooks/useCore', () => () => ({
  core: {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    getGroupAnnotations: jest.fn(() => []),
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
  getNoteTransformFunction: () => null,
  getCustomNoteSelectionFunction: () => null,
  getUnreadAnnotationIdSet: () => new Set(),
  isCommentThreadExpansionEnabled: () => false,
  isRightClickAnnotationPopupEnabled: () => true,
  getActiveDocumentViewerKey: () => 1,
  getIsOfficeEditorMode: () => false,
  getOfficeEditorEditMode: () => 'editing',
}));

jest.mock('components/NoteContent', () => {
  return function MockNoteContent({ annotation, editingKey, isEditing, setIsEditing }) {
    return (
      <button
        data-testid={`note-content-${annotation.Id}`}
        data-is-editing={Boolean(isEditing)}
        onClick={() => setIsEditing(true, editingKey)}
      >
        {annotation.Id}
      </button>
    );
  };
});

jest.mock('components/Note/ReplyArea', () => {
  return function MockReplyArea() {
    return <div data-testid="reply-area" />;
  };
});

jest.mock('components/Button', () => {
  return function MockButton({ onClick, dataElement, className, label }) {
    return (
      <button data-element={dataElement} className={className} onClick={onClick}>
        {label}
      </button>
    );
  };
});

jest.mock('src/helpers/isAnnotationRenderedInDisplayMode', () => ({
  isAnnotationRenderedInDisplayMode: () => true,
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
    await userEvent.click(screen.getByTestId('note-content-reply-3'));
    expect(screen.getByTestId('note-content-reply-3')).toHaveAttribute('data-is-editing', 'true');

    // Simulate deleting a reply above it and rerender thread
    currentReplies = [reply2, reply3];
    rerender(
      <NoteContext.Provider value={baseContext}>
        <Note {...props} />
      </NoteContext.Provider>
    );

    // The lower reply should still be in editing state after indices shift.
    expect(screen.getByTestId('note-content-reply-3')).toHaveAttribute('data-is-editing', 'true');
  });
});