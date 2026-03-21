import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import ReplyArea from './ReplyArea';
import NoteContext from 'components/Note/Context';
import useCore from 'hooks/useCore';
import mentionsManager from 'helpers/MentionsManager';

const TestReplyArea = withProviders(ReplyArea, {
  viewer: {
    isOfficeEditorMode: true,
  },
  officeEditor: {
    editMode: 'editing',
  },
});

jest.mock('hooks/useCore');
jest.mock('helpers/MentionsManager');
jest.mock('components/NoteTextarea', () => {
  const React = require('react');
  const MockNoteTextarea = React.forwardRef((props, ref) => {
    const mockEditor = {
      getContents: () => ({ ops: [] }),
      getLength: () => 1,
    };
    const mockTextarea = {
      getEditor: () => mockEditor,
      editor: { setSelection: jest.fn() },
    };

    if (typeof ref === 'function') {
      ref(mockTextarea);
    } else if (ref) {
      ref.current = mockTextarea;
    }

    return <div data-testid="note-textarea" {...props} />;
  });
  MockNoteTextarea.displayName = 'MockNoteTextarea';
  return MockNoteTextarea;
});

jest.mock('components/Button', () => {
  const MockButton = ({ onClick, disabled, title }) => (
    <button onClick={onClick} disabled={disabled} type="button">
      {title}
    </button>
  );
  MockButton.displayName = 'MockButton';
  return MockButton;
});

jest.mock('actions', () => ({
  finishNoteEditing: jest.fn(() => ({ type: 'FINISH_NOTE_EDITING' })),
}));

describe('ReplyArea (Office Editor)', () => {
  let addCommentReplyMock;

  beforeEach(() => {
    addCommentReplyMock = jest.fn().mockResolvedValue(undefined);
    useCore.mockReturnValue({
      core: {
        getOfficeEditor: () => ({
          getCommentManager: () => ({ addCommentReply: addCommentReplyMock }),
        }),
      },
    });
    mentionsManager.getFormattedTextFromDeltas.mockReturnValue('Reply text');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const createAnnotation = (officeEditorCommentUID) => ({
    Id: 100,
    getCustomData: jest.fn((key) => key === 'officeEditorCommentUID' ? officeEditorCommentUID : undefined),
  });

  const createContextValue = (overrides = {}) => ({
    isContentEditable: false,
    isSelected: true,
    pendingReplyMap: { 100: 'draft' },
    setPendingReply: jest.fn(),
    isExpandedFromSearch: false,
    scrollToSelectedAnnot: false,
    setCurAnnotId: jest.fn(),
    pendingAttachmentMap: {},
    clearAttachments: jest.fn(),
    deleteAttachment: jest.fn(),
    isOfficeEditorCommentAnnotation: true,
    ...overrides,
  });

  const renderReplyArea = (annotation, contextOverrides = {}) => {
    const contextValue = createContextValue(contextOverrides);
    return {
      ...render(
        <NoteContext.Provider value={contextValue}>
          <TestReplyArea annotation={annotation} />
        </NoteContext.Provider>
      ),
      contextValue,
    };
  };

  it('posts reply using officeEditorCommentUID from annotation customData as parentId', async () => {
    const annotation = createAnnotation('42');
    const { container } = renderReplyArea(annotation);

    fireEvent.submit(container.querySelector('form'));

    await waitFor(() => {
      expect(addCommentReplyMock).toHaveBeenCalledTimes(1);
      expect(addCommentReplyMock).toHaveBeenCalledWith(42, 'Reply text');
    });
  });

  it('does not post reply when officeEditorCommentUID is not a valid number', async () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const annotation = createAnnotation('invalid-id');
    const { container } = renderReplyArea(annotation);

    fireEvent.submit(container.querySelector('form'));

    await waitFor(() => {
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Failed to post reply to office editor comment',
        new Error('Invalid comment id')
      );
    });
    expect(addCommentReplyMock).not.toHaveBeenCalled();
    consoleWarnSpy.mockRestore();
  });

  it('does not post reply when reply text is empty', async () => {
    mentionsManager.getFormattedTextFromDeltas.mockReturnValue('   ');
    const annotation = createAnnotation('42');
    const { container } = renderReplyArea(annotation);

    fireEvent.submit(container.querySelector('form'));

    await waitFor(() => {
      expect(addCommentReplyMock).not.toHaveBeenCalled();
    });
  });
});
