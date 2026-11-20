import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import i18next from 'i18next';
import NoteContent from './NoteContent';
import NoteContext from '../Note/Context';
import initialState from 'src/redux/initialState';
import Theme from 'constants/theme';
import { OFFICE_EDITOR_TRACKED_CHANGE_KEY } from 'constants/officeEditor';

// Record what reaches NoteTextPreview so rerenders can be observed without its layout logic.
jest.mock('components/NoteTextPreview', () => {
  const React = require('react');
  const renderSpy = jest.fn();
  const MockNoteTextPreview = (props) => {
    renderSpy(props);
    const { children, textStyle, beforeContent } = props;
    return (
      <div data-testid="note-text-preview" data-color={textStyle?.color}>
        {beforeContent?.()}
        {children}
      </div>
    );
  };
  return { __esModule: true, default: MockNoteTextPreview, renderSpy };
});
jest.mock('components/NoteHeader', () => () => null);
jest.mock('hooks/useCore', () => {
  const core = {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    getDisplayAuthor: () => 'Author',
  };
  return () => ({ core });
});

const { renderSpy: noteTextPreviewRenderSpy } = jest.requireMock('components/NoteTextPreview');
const TestNoteContent = withI18n(NoteContent);

const createAnnotation = ({ contents = 'plain note text', preview = '' } = {}) => {
  const annotation = new window.Core.Annotations.RectangleAnnotation();
  annotation.Author = 'Author';
  annotation.setContents(contents);
  annotation.setCustomData('trn-annot-preview', preview);
  return annotation;
};

const createTrackedChange = (trackedChangeType) => {
  const annotation = new window.Core.Annotations.TextHighlightAnnotation();
  annotation['Id'] = 'tracked-change-1';
  annotation.Author = 'Author';
  annotation.setContents('changed text');
  annotation.setCustomData(OFFICE_EDITOR_TRACKED_CHANGE_KEY, 'tracked-change-1');
  annotation['TrackedChangeType'] = trackedChangeType;
  annotation['FillColor'] = new window.Core.Annotations.Color(0, 0, 255, 1);
  return annotation;
};

const contextValue = {
  isSelected: false,
  searchInput: '',
  resize: jest.fn(),
  pendingEditTextMap: {},
  onTopNoteContentClicked: jest.fn(),
  setPendingEditText: jest.fn(),
  noteFlyoutIdSuffix: '',
};

// Stable props so a rerender only differs by the input under test.
const noteProps = {
  isEditing: false,
  setIsEditing: jest.fn(),
  onReplyClicked: jest.fn(),
};

describe('NoteContent rerender updates', () => {
  let store;

  // Dispatch like the real APIs do, so NoteContent updates through its own useSelector subscription.
  const setViewerState = (viewerOverrides) => {
    act(() => {
      store.dispatch({ type: 'test/setViewerState', payload: viewerOverrides });
    });
  };

  const renderNote = (annotation, { handleNoteClick, resize = contextValue.resize } = {}) => {
    const tree = (currentAnnotation, currentHandleNoteClick, currentResize) => (
      <Provider store={store}>
        {/* A new context object per render, as NotesPanel builds one per renderChild call. */}
        <NoteContext.Provider value={{ ...contextValue, resize: currentResize }}>
          <TestNoteContent annotation={currentAnnotation} {...noteProps} handleNoteClick={currentHandleNoteClick} />
        </NoteContext.Provider>
      </Provider>
    );
    const result = render(tree(annotation, handleNoteClick, resize));
    return {
      ...result,
      rerenderNote: (nextAnnotation = annotation, next = {}) => result.rerender(tree(
        nextAnnotation,
        next.handleNoteClick ?? handleNoteClick,
        next.resize ?? resize,
      )),
    };
  };

  beforeEach(() => {
    noteTextPreviewRenderSpy.mockClear();
    store = configureStore({
      preloadedState: {
        ...initialState,
        viewer: {
          ...initialState.viewer,
          activeTheme: Theme.LIGHT,
          isNotesPanelTextCollapsingEnabled: true,
          isNotesPanelRepliesCollapsingEnabled: true,
        },
      },
      reducer: (state, action) => (action.type === 'test/setViewerState'
        ? { ...state, viewer: { ...state.viewer, ...action.payload } }
        : state),
      middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false, immutableCheck: false }),
    });
  });

  afterEach(async () => {
    await act(() => i18next.changeLanguage('en'));
  });

  it('collapses an already-rendered comment when text collapsing is turned on', () => {
    setViewerState({ isNotesPanelTextCollapsingEnabled: false });
    renderNote(createAnnotation());
    expect(screen.queryByTestId('note-text-preview')).not.toBeInTheDocument();

    setViewerState({ isNotesPanelTextCollapsingEnabled: true });

    expect(screen.getByTestId('note-text-preview')).toHaveTextContent('plain note text');
  });

  it('collapses an already-rendered selected-text preview when text collapsing is turned on', () => {
    setViewerState({ isNotesPanelTextCollapsingEnabled: false });
    const { container } = renderNote(createAnnotation({ contents: '', preview: 'selected text' }));
    expect(container.querySelector('[data-element="notesSelectedTextPreview"]')).not.toBeInTheDocument();

    setViewerState({ isNotesPanelTextCollapsingEnabled: true });

    expect(container.querySelector('[data-element="notesSelectedTextPreview"]')).toHaveTextContent('"selected text"');
  });

  it('recolors an already-rendered comment when the theme changes', () => {
    const { Color } = window.Core.Annotations;
    const annotation = createAnnotation();
    annotation['TextColor'] = new Color(0, 0, 0, 1);
    renderNote(annotation);
    expect(screen.getByTestId('note-text-preview')).toHaveAttribute('data-color', new Color(0, 0, 0, 1).toHexString());

    setViewerState({ activeTheme: Theme.DARK });

    expect(screen.getByTestId('note-text-preview')).toHaveAttribute('data-color', new Color(255, 255, 255, 1).toHexString());
  });

  it('updates the tracked-change label when the tracked change is recreated with another type', () => {
    const { container, rerenderNote } = renderNote(createTrackedChange(1));
    expect(container.querySelector('.tracked-change-label')).toHaveTextContent('Added');

    // TrackedChangeManager recreates the annotation when a tracked change is updated.
    rerenderNote(createTrackedChange(2));

    expect(container.querySelector('.tracked-change-label')).toHaveTextContent('Deleted');
  });

  it('updates the tracked-change label when the language changes', async () => {
    const { container } = renderNote(createTrackedChange(2));
    expect(container.querySelector('.tracked-change-label')).toHaveTextContent('Deleted');

    await act(() => i18next.changeLanguage('fr'));

    expect(container.querySelector('.tracked-change-label')).toHaveTextContent('Supprimé');
  });

  it('keeps the note memoized but calls the latest parent callbacks after a parent rerender', () => {
    const annotation = createAnnotation();
    const firstClick = jest.fn();
    const firstResize = jest.fn();
    const { container, rerenderNote } = renderNote(annotation, { handleNoteClick: firstClick, resize: firstResize });
    const renderCount = noteTextPreviewRenderSpy.mock.calls.length;
    expect(renderCount).toBeGreaterThan(0);

    // Note and NotesPanel recreate these callbacks on every render.
    const latestClick = jest.fn();
    const latestResize = jest.fn();
    rerenderNote(annotation, { handleNoteClick: latestClick, resize: latestResize });

    expect(noteTextPreviewRenderSpy).toHaveBeenCalledTimes(renderCount);

    fireEvent.click(container.querySelector('.container'));
    expect(latestClick).toHaveBeenCalledTimes(1);
    expect(firstClick).not.toHaveBeenCalled();

    noteTextPreviewRenderSpy.mock.lastCall[0].resize();
    expect(latestResize).toHaveBeenCalledTimes(1);
    expect(firstResize).not.toHaveBeenCalled();
  });
});
