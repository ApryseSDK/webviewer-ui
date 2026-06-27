import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ReplyArea from './ReplyArea';
import NoteContext from 'components/Note/Context';
import useReplyAutosave from 'hooks/useReplyAutosave/useReplyAutosave';
import { setAnnotationAttachments } from 'helpers/ReplyAttachmentManager';
import Events from 'constants/events';

jest.mock('hooks/useCore', () => () => ({
  core: {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    getOfficeEditor: jest.fn(() => ({
      getCommentManager: jest.fn(() => ({ addCommentReply: jest.fn() })),
    })),
    createAnnotationReply: jest.fn(() => ({})),
    getAnnotationManager: jest.fn(() => ({ trigger: jest.fn() })),
    addAnnotations: jest.fn(),
  },
}));

jest.mock('hooks/useReplyAutosave/useReplyAutosave');
jest.mock('helpers/MentionsManager', () => ({
  getFormattedTextFromDeltas: jest.fn(() => 'reply text'),
}));
jest.mock('helpers/setAnnotationRichTextStyle', () => jest.fn());
jest.mock('helpers/ReplyAttachmentManager', () => ({
  setAnnotationAttachments: jest.fn(() => Promise.resolve()),
}));

jest.mock('components/NoteTextarea', () => {
  const React = require('react');
  const mockEditor = {
    getContents: jest.fn(() => ({ ops: [] })),
    getLength: jest.fn(() => 1),
    setText: jest.fn(),
  };
  const MockNoteTextarea = React.forwardRef(({ value, onChange }, ref) => {
    const mockTextarea = {
      getEditor: jest.fn(() => mockEditor),
      focus: jest.fn(),
      editor: {
        setSelection: jest.fn(),
      },
    };

    if (typeof ref === 'function') {
      ref(mockTextarea);
    } else if (ref) {
      ref.current = mockTextarea;
    }

    return React.createElement('input', {
      'data-testid': 'note-textarea',
      value: value || '',
      onChange: (e) => onChange(e.target.value),
    });
  });
  MockNoteTextarea.displayName = 'MockNoteTextarea';
  MockNoteTextarea.mockEditor = mockEditor;
  return MockNoteTextarea;
});

jest.mock('components/Button', () => {
  const MockButton = ({ disabled, onClick, title }) => (
    <button type="button" disabled={disabled} onClick={onClick}>
      {title}
    </button>
  );
  MockButton.displayName = 'MockButton';
  return MockButton;
});

const createContextValue = (overrides = {}) => ({
  isContentEditable: false,
  isSelected: true,
  setPendingReply: jest.fn(),
  isExpandedFromSearch: false,
  scrollToSelectedAnnot: false,
  setCurAnnotId: jest.fn(),
  pendingAttachmentMap: {},
  clearAttachments: jest.fn(),
  deleteAttachment: jest.fn(),
  isOfficeEditorCommentAnnotation: false,
  ...overrides,
});

const createAnnotation = () => ({
  Id: 'a1',
  X: 1,
  Y: 1,
  PageNumber: 1,
  addReply: jest.fn(),
  deleteReply: jest.fn(),
  getCustomData: jest.fn(),
});

const createAutosaveValue = (overrides = {}) => ({
  localReplyValue: '',
  setLocalReplyValue: jest.fn(),
  showAutosaved: false,
  isSubmitClickRef: { current: false },
  clearDraft: jest.fn(),
  ...overrides,
});

const renderComponent = (autosaveValue, contextValue, props = {}) => {
  useReplyAutosave.mockReturnValue(autosaveValue);
  const TestReplyArea = withProviders(ReplyArea, {
    viewer: {
      autosaveEnabled: true,
      autosaveInterval: 100,
    },
    officeEditor: {
      editMode: 'editing',
    },
  });

  return render(
    <NoteContext.Provider value={contextValue}>
      <TestReplyArea annotation={createAnnotation()} {...props} />
    </NoteContext.Provider>
  );
};

describe('ReplyArea autosave integration', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('dispatches autosaved event when autosave is enabled and hook marks saved state', async () => {
    const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');
    const contextValue = createContextValue();
    renderComponent(createAutosaveValue({ showAutosaved: true }), contextValue);

    await waitFor(() => {
      expect(dispatchEventSpy).toHaveBeenCalled();
    });

    const autosavedEvent = dispatchEventSpy.mock.calls[0][0];
    expect(autosavedEvent.type).toBe(Events.NOTE_AUTOSAVED);
    expect(autosavedEvent.detail.annotationId).toBe('a1');
    expect(screen.queryByText('Saved')).not.toBeInTheDocument();

    dispatchEventSpy.mockRestore();
  });

  it('disables submit button when local reply value is empty', () => {
    const contextValue = createContextValue();
    renderComponent(createAutosaveValue({ localReplyValue: '' }), contextValue);

    expect(screen.getByRole('button', { name: 'action.submit' })).toBeDisabled();
  });

  it('routes textarea changes through autosave local state and pending reply callbacks', () => {
    const setLocalReplyValue = jest.fn();
    const setPendingReply = jest.fn();
    const onPendingReplyChange = jest.fn();
    const contextValue = createContextValue({ setPendingReply });

    renderComponent(
      createAutosaveValue({
        localReplyValue: '',
        setLocalReplyValue,
      }),
      contextValue,
      { onPendingReplyChange }
    );

    fireEvent.change(screen.getByTestId('note-textarea'), {
      target: { value: 'draft reply' },
    });

    expect(setLocalReplyValue).toHaveBeenCalledWith('draft reply');
    expect(setPendingReply).toHaveBeenCalledWith('reply text', 'a1');
    expect(onPendingReplyChange).toHaveBeenCalledTimes(1);
  });

  it('normalizes empty editor content to empty pending reply value', () => {
    const mentionsManager = require('helpers/MentionsManager');
    mentionsManager.getFormattedTextFromDeltas.mockReturnValueOnce('   ');

    const setPendingReply = jest.fn();
    const contextValue = createContextValue({ setPendingReply });

    renderComponent(
      createAutosaveValue({
        localReplyValue: '',
      }),
      contextValue
    );

    fireEvent.change(screen.getByTestId('note-textarea'), {
      target: { value: 'x' },
    });

    expect(setPendingReply).toHaveBeenCalledWith('', 'a1');
  });

  it('uses pendingReplyMap value for office editor reply input', () => {
    const contextValue = createContextValue({
      isOfficeEditorCommentAnnotation: true,
      pendingReplyMap: { a1: 'pending office draft' },
    });

    renderComponent(createAutosaveValue(), contextValue);

    expect(screen.getByTestId('note-textarea')).toHaveValue('pending office draft');
  });

  it('routes office editor textarea changes directly to pending reply map', () => {
    const setLocalReplyValue = jest.fn();
    const setPendingReply = jest.fn();
    const onPendingReplyChange = jest.fn();
    const contextValue = createContextValue({
      isOfficeEditorCommentAnnotation: true,
      setPendingReply,
      pendingReplyMap: { a1: '' },
    });

    renderComponent(
      createAutosaveValue({
        localReplyValue: '',
        setLocalReplyValue,
      }),
      contextValue,
      { onPendingReplyChange }
    );

    fireEvent.change(screen.getByTestId('note-textarea'), {
      target: { value: 'office draft reply' },
    });

    expect(setPendingReply).toHaveBeenCalledWith('office draft reply', 'a1');
    expect(setLocalReplyValue).not.toHaveBeenCalled();
    expect(onPendingReplyChange).toHaveBeenCalledTimes(1);
  });

  it('keeps draft state intact when non-office reply submission fails', async () => {
    const noteTextareaModule = require('components/NoteTextarea');
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const clearDraft = jest.fn();
    const setPendingReply = jest.fn();
    const clearAttachments = jest.fn();
    const autosaveValue = createAutosaveValue({
      localReplyValue: 'draft reply',
      clearDraft,
      isSubmitClickRef: { current: false },
    });
    const contextValue = createContextValue({
      setPendingReply,
      clearAttachments,
    });
    const error = new Error('Failed to attach files');

    setAnnotationAttachments.mockRejectedValueOnce(error);

    renderComponent(autosaveValue, contextValue);

    fireEvent.click(screen.getByRole('button', { name: 'action.submit' }));

    await waitFor(() => {
      expect(consoleWarnSpy).toHaveBeenCalledWith('Failed to post reply', error);
    });

    expect(clearDraft).not.toHaveBeenCalled();
    expect(setPendingReply).not.toHaveBeenCalled();
    expect(clearAttachments).not.toHaveBeenCalled();
    expect(noteTextareaModule.mockEditor.setText).not.toHaveBeenCalled();

    consoleWarnSpy.mockRestore();
  });
});
