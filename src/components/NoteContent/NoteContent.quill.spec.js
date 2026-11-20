import React from 'react';
import { act, render } from '@testing-library/react';
import { Quill } from 'react-quill-new';
import NoteContent from './NoteContent';
import NoteContext from '../Note/Context';
import initialState from 'src/redux/initialState';

jest.mock('components/NoteHeader', () => () => null);
jest.mock('hooks/useCore', () => {
  const core = {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    getDisplayAuthor: () => 'Author',
  };
  return () => ({ core });
});

const TestNoteContent = withProviders(NoteContent, {
  ...initialState,
  viewer: {
    ...initialState.viewer,
    isOfficeEditorMode: true,
    autoFocusNoteOnAnnotationSelection: true,
    isNoteEditing: true,
    autosaveEnabled: false,
    openElements: { notesPanel: true },
  },
});

const createAnnotation = (id) => ({
  Id: id,
  Author: 'Author',
  isReply: () => id !== 'comment',
  getContents: () => 'original note',
  getReplies: () => [],
  getRichTextStyle: () => undefined,
  getAttachments: () => [],
  getCustomData: () => '',
  getSkipAutoLink: () => false,
});

const Notes = ({ context, annotations }) => {
  const [, setCurAnnotId] = React.useState();
  return (
    <NoteContext.Provider value={{ ...context, setCurAnnotId }}>
      {annotations.map((annotation) => (
        <TestNoteContent key={annotation.Id} annotation={annotation} isEditing setIsEditing={jest.fn()} />
      ))}
      <textarea aria-label="Document" />
    </NoteContext.Provider>
  );
};

// Keep ReactQuill, Quill, and NoteTextarea real: a plain input cannot reproduce
// controlled HTML reconciliation restoring a previously focused selection.
describe('Office comment focus with Quill', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // A regression can loop through focus and context updates indefinitely.
    // Fail fast instead of hanging Jest; do not assert an exact focus count.
    const focus = HTMLElement.prototype.focus;
    let focusCount = 0;
    jest.spyOn(HTMLElement.prototype, 'focus').mockImplementation(function(...args) {
      if (++focusCount > 100) {
        throw new Error('Office comment editors are repeatedly reclaiming focus');
      }
      return focus.apply(this, args);
    });
    // jsdom has no text-range geometry; retain real focus and selection behavior.
    jest.spyOn(Quill.prototype, 'scrollSelectionIntoView').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it.each([false, true])('preserves content and document focus across panel rerenders (restore text: %s)', async (restoreText) => {
    const contextValue = {
      isSelected: true,
      searchInput: '',
      pendingEditTextMap: {},
      pendingAttachmentMap: {},
      isOfficeEditorCommentAnnotation: true,
      resize: jest.fn(),
      setPendingEditText: jest.fn(),
      addAttachments: jest.fn(),
    };
    const annotations = ['comment', 'reply-1', 'reply-2'].map(createAnnotation);
    const tree = (context) => <Notes context={context} annotations={annotations} />;
    const { container, rerender, getByRole } = render(tree(contextValue));
    await act(async () => jest.runOnlyPendingTimers());
    const editors = Array.from(container.querySelectorAll('.ql-container')).filter((element) => Quill.find(element));
    const editor = Quill.find(editors[editors.length - 1]);
    expect(editor).toBeDefined();

    if (restoreText) {
      await act(async () => {
        editor.setText('edited note');
        jest.runOnlyPendingTimers();
      });
      await act(async () => {
        editor.setText('original note');
        jest.runOnlyPendingTimers();
      });
    }
    const documentSurface = getByRole('textbox', { name: 'Document' });
    act(() => documentSurface.focus());
    rerender(tree({ ...contextValue }));
    await act(async () => jest.runOnlyPendingTimers());

    expect(documentSurface).toHaveFocus();
    expect(editor.getText()).toBe('original note\n');
  });
});
