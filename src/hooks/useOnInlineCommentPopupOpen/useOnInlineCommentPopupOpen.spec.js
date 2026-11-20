import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import core from 'core';
import actions from 'actions';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import useOnInlineCommentPopupOpen from './useOnInlineCommentPopupOpen';
import { isAnnotationInView } from 'helpers/getPopupPosition';
import DataElements from 'constants/dataElement';
import {
  SPREADSHEET_THREAD_ID_KEY,
  SPREADSHEET_SHEET_INDEX_KEY,
  SPREADSHEET_ROW_KEY,
  SPREADSHEET_COLUMN_KEY,
} from 'constants/spreadsheetEditor';
import { OFFICE_EDITOR_SPELL_CHECK_KEY } from 'constants/officeEditor';

jest.mock('core');
jest.mock('helpers/getPopupPosition', () => ({
  isAnnotationInView: jest.fn(),
}));
jest.mock('actions', () => ({
  openElement: jest.fn((element) => ({ type: 'OPEN_ELEMENT', payload: element })),
  closeElement: jest.fn((element) => ({ type: 'CLOSE_ELEMENT', payload: element })),
}));

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const MockComponent = ({ children }) => (<div>{children}</div>);
const createWrapper = ({ viewer = {}, topLeftRow = null, topLeftColumn = null } = {}) => withProviders(MockComponent, {
  viewer: {
    inlineCommentFilter: () => true,
    ...viewer,
  },
  spreadsheetEditor: {
    cellProperties: { topLeftRow, topLeftColumn },
  },
});
const wrapper = createWrapper();

const createAnnotation = (customData = {}) => ({
  getPageNumber: () => 1,
  getCustomData: (key) => customData[key],
});

const createSpellCheckAnnotation = () => createAnnotation({ [OFFICE_EDITOR_SPELL_CHECK_KEY]: '0' });

const openInlineCommentPopupAction = actions.openElement(DataElements.INLINE_COMMENT_POPUP);

const createSpreadsheetComment = ({ id = 'comment-1', sheetIndex = 0, row = 0, column = 0, listable = true } = {}) => {
  const customData = {
    [SPREADSHEET_THREAD_ID_KEY]: `thread-${id}`,
    [SPREADSHEET_SHEET_INDEX_KEY]: String(sheetIndex),
    [SPREADSHEET_ROW_KEY]: String(row),
    [SPREADSHEET_COLUMN_KEY]: String(column),
  };
  const comment = Object.create(window.Core.Annotations.StickyAnnotation.prototype);
  // Defined directly because Id and Listable are prototype accessors that write to internal annotation state.
  Object.defineProperties(comment, {
    Id: { value: id },
    Listable: { value: listable },
    getPageNumber: { value: () => 1 },
    getCustomData: { value: (key) => customData[key] || '' },
  });
  return comment;
};

describe('useOnInlineCommentPopupOpen hook', () => {
  let onAnnotationSelectedHandler;
  let onMouseLeftUpHandler;
  let selectedAnnotations;
  // Currently registered core listeners by event name, so tests can fire any of them and see removals.
  let activeListeners;
  const getListeners = (event) => activeListeners[event] || [];
  const fireCoreEvent = (event, ...args) => act(() => {
    getListeners(event).forEach((handler) => handler(...args));
  });

  const selectAnnotations = (annotations) => {
    act(() => onAnnotationSelectedHandler(annotations, 'selected'));
  };
  const selectAnnotation = (annotation) => selectAnnotations([annotation]);
  const renderInlineCommentHook = () => renderHook(() => useOnInlineCommentPopupOpen(), { wrapper });
  const mouseLeftUp = () => {
    act(() => onMouseLeftUpHandler({}));
  };

  beforeEach(() => {
    jest.clearAllMocks();
    onAnnotationSelectedHandler = undefined;
    activeListeners = {};
    // In view by default so tests asserting the popup stays closed fail only for the reason under test
    isAnnotationInView.mockReturnValue(true);
    core.addEventListener = jest.fn((event, handler) => {
      activeListeners[event] = [...getListeners(event), handler];
      if (event === 'annotationSelected') {
        onAnnotationSelectedHandler = handler;
      }
      if (event === 'mouseLeftUp') {
        onMouseLeftUpHandler = handler;
      }
    });
    core.getAnnotationsByMouseEvent = jest.fn(() => []);
    // Mirror core's selection list, where selecting only adds to it and deselecting removes from it
    selectedAnnotations = [];
    core.getSelectedAnnotations = jest.fn(() => [...selectedAnnotations]);
    core.isAnnotationSelected = jest.fn((annotation) => selectedAnnotations.includes(annotation));
    core.selectAnnotation = jest.fn((annotation) => {
      selectedAnnotations.push(annotation);
      onAnnotationSelectedHandler([annotation], 'selected');
    });
    core.deselectAnnotation = jest.fn((annotation) => {
      selectedAnnotations = selectedAnnotations.filter((annot) => annot !== annotation);
      onAnnotationSelectedHandler([annotation], 'deselected');
    });
    core.removeEventListener = jest.fn((event, handler) => {
      activeListeners[event] = getListeners(event).filter((registered) => registered !== handler);
    });
    core.getAnnotationsList = jest.fn(() => []);
    core.deselectAllAnnotations = jest.fn();
  });

  it('should dispatch openElement when annotation is in view', () => {
    renderInlineCommentHook();
    selectAnnotation(createAnnotation());

    expect(mockDispatch).toHaveBeenCalledWith(openInlineCommentPopupAction);
  });

  it('should not dispatch openElement when annotation is not in view', () => {
    isAnnotationInView.mockReturnValue(false);
    const annotation = createAnnotation();
    const { result } = renderInlineCommentHook();
    selectAnnotation(annotation);

    expect(result.current.annotation).toBe(annotation);
    expect(mockDispatch).not.toHaveBeenCalledWith(openInlineCommentPopupAction);
  });

  describe('spell check annotations', () => {
    it('should not track or open the popup for a spell check annotation on its own', () => {
      const { result } = renderInlineCommentHook();
      selectAnnotation(createSpellCheckAnnotation());

      expect(mockDispatch).not.toHaveBeenCalledWith(openInlineCommentPopupAction);
      expect(result.current.annotation).toBeNull();
    });

    it('should track the first non-spell-check annotation when selected together with a spell check annotation', () => {
      const comment = createAnnotation();
      const { result } = renderInlineCommentHook();
      selectAnnotations([createSpellCheckAnnotation(), comment]);

      expect(result.current.annotation).toBe(comment);
      expect(mockDispatch).toHaveBeenCalledWith(openInlineCommentPopupAction);
    });

    it('should open the popup for the topmost non-spell-check annotation and leave only it selected when a click selects the spell check annotation on top', () => {
      const spellCheck = createSpellCheckAnnotation();
      const topComment = createAnnotation();
      const bottomComment = createAnnotation();
      core.getAnnotationsByMouseEvent.mockReturnValue([spellCheck, topComment, bottomComment]);
      selectedAnnotations = [spellCheck];
      const { result } = renderInlineCommentHook();
      mouseLeftUp();

      expect(result.current.annotation).toBe(topComment);
      expect(core.getSelectedAnnotations()).toEqual([topComment]);
      expect(mockDispatch).toHaveBeenCalledWith(openInlineCommentPopupAction);
    });

    it('should close the popup and not ask core to select anything when the click only hits a spell check annotation', () => {
      const comment = createAnnotation();
      const spellCheck = createSpellCheckAnnotation();
      const { result } = renderInlineCommentHook();
      selectAnnotation(comment);
      expect(result.current.annotation).toBe(comment);

      core.getAnnotationsByMouseEvent.mockReturnValue([spellCheck]);
      selectedAnnotations = [spellCheck];
      mouseLeftUp();

      expect(result.current.annotation).toBeNull();
      // Selecting "nothing" would throw inside core, so the hand-off must be skipped
      expect(core.selectAnnotation).not.toHaveBeenCalled();
    });
  });

  describe('spreadsheet editor comments', () => {
    const spreadsheetViewer = { isSpreadsheetEditorModeEnabled: true };

    it('should open the popup when a spreadsheet editor comment is selected', () => {
      isAnnotationInView.mockReturnValue(false);
      renderHook(() => useOnInlineCommentPopupOpen(), { wrapper: createWrapper({ viewer: spreadsheetViewer }) });
      act(() => onAnnotationSelectedHandler([createSpreadsheetComment()], 'selected'));

      expect(mockDispatch).toHaveBeenCalledWith(actions.openElement(DataElements.INLINE_COMMENT_POPUP));
    });

    it.each(['pointerup', 'pointercancel'])('should wait for %s before opening, so the sheet receives the mouseup', (pointerEnd) => {
      renderHook(() => useOnInlineCommentPopupOpen(), { wrapper: createWrapper({ viewer: spreadsheetViewer }) });

      act(() => {
        window.dispatchEvent(new Event('pointerdown'));
        onAnnotationSelectedHandler([createSpreadsheetComment()], 'selected');
      });
      expect(mockDispatch).not.toHaveBeenCalledWith(actions.openElement(DataElements.INLINE_COMMENT_POPUP));

      act(() => {
        window.dispatchEvent(new Event(pointerEnd));
      });
      expect(mockDispatch).toHaveBeenCalledWith(actions.openElement(DataElements.INLINE_COMMENT_POPUP));
    });

    describe('after the popup was closed while the commented cell stays selected', () => {
      let sheet;
      let toolbar;

      beforeEach(() => {
        sheet = document.createElement('div');
        toolbar = document.createElement('div');
        document.body.append(sheet, toolbar);
        core.getViewerElement = jest.fn(() => sheet);
      });

      afterEach(() => {
        sheet.remove();
        toolbar.remove();
      });

      const selectCommentThenClick = (clickTarget) => {
        renderHook(() => useOnInlineCommentPopupOpen(), { wrapper: createWrapper({ viewer: spreadsheetViewer }) });
        act(() => onAnnotationSelectedHandler([createSpreadsheetComment()], 'selected'));
        mockDispatch.mockClear();
        act(() => {
          clickTarget.dispatchEvent(new Event('pointerdown', { bubbles: true, composed: true }));
          clickTarget.dispatchEvent(new Event('pointerup', { bubbles: true, composed: true }));
        });
      };

      it('should reopen the popup when the sheet is clicked', () => {
        selectCommentThenClick(sheet);

        expect(mockDispatch).toHaveBeenCalledWith(actions.openElement(DataElements.INLINE_COMMENT_POPUP));
      });

      it('should reopen the popup when the sheet is clicked from inside a nested shadow root', () => {
        const host = document.createElement('div');
        document.body.appendChild(host);
        const viewer = document.createElement('div');
        const inner = document.createElement('button');
        viewer.appendChild(inner);
        host.attachShadow({ mode: 'open' }).appendChild(viewer);
        core.getViewerElement = jest.fn(() => viewer);

        selectCommentThenClick(inner);
        host.remove();

        expect(mockDispatch).toHaveBeenCalledWith(actions.openElement(DataElements.INLINE_COMMENT_POPUP));
      });

      it('should reopen the popup for the selected comment when the hook lost its annotation', () => {
        const comment = createSpreadsheetComment();
        renderHook(() => useOnInlineCommentPopupOpen(), { wrapper: createWrapper({ viewer: spreadsheetViewer }) });
        act(() => onAnnotationSelectedHandler([comment], 'selected'));
        act(() => onAnnotationSelectedHandler([comment], 'deselected'));
        core.getSelectedAnnotations.mockReturnValue([comment]);
        mockDispatch.mockClear();

        act(() => {
          sheet.dispatchEvent(new Event('pointerdown', { bubbles: true, composed: true }));
          sheet.dispatchEvent(new Event('pointerup', { bubbles: true, composed: true }));
        });

        expect(mockDispatch).toHaveBeenCalledWith(actions.openElement(DataElements.INLINE_COMMENT_POPUP));
      });

      it('should not reopen the popup when something outside the sheet is clicked', () => {
        selectCommentThenClick(toolbar);

        expect(mockDispatch).not.toHaveBeenCalledWith(actions.openElement(DataElements.INLINE_COMMENT_POPUP));
      });
    });

    it('should not reopen a closed popup when the pointer is released after an unrelated click', () => {
      renderHook(() => useOnInlineCommentPopupOpen(), { wrapper: createWrapper({ viewer: spreadsheetViewer }) });
      act(() => onAnnotationSelectedHandler([createSpreadsheetComment()], 'selected'));
      mockDispatch.mockClear();

      act(() => {
        window.dispatchEvent(new Event('pointerdown'));
        window.dispatchEvent(new Event('pointerup'));
      });

      expect(mockDispatch).not.toHaveBeenCalledWith(actions.openElement(DataElements.INLINE_COMMENT_POPUP));
    });

    it('should leave the popup open on mouse up, since a spreadsheet cell is never an annotation under the mouse', () => {
      core.getAnnotationManager = jest.fn(() => ({ getAnnotationsByMouseEvent: jest.fn(() => []) }));
      renderHook(() => useOnInlineCommentPopupOpen(), { wrapper: createWrapper({ viewer: spreadsheetViewer }) });
      act(() => onAnnotationSelectedHandler([createSpreadsheetComment()], 'selected'));
      mockDispatch.mockClear();

      expect(getListeners('mouseLeftUp')).toHaveLength(1);
      fireCoreEvent('mouseLeftUp', {});

      expect(mockDispatch).not.toHaveBeenCalledWith(actions.closeElement(DataElements.INLINE_COMMENT_POPUP));
    });

    it('should select a comment that is added to the active cell after the hook rendered', () => {
      renderHook(() => useOnInlineCommentPopupOpen(), {
        wrapper: createWrapper({ viewer: spreadsheetViewer, topLeftRow: 2, topLeftColumn: 3 }),
      });
      expect(core.selectAnnotation).not.toHaveBeenCalled();

      const addedComment = createSpreadsheetComment({ row: 2, column: 3 });
      core.getAnnotationsList.mockReturnValue([addedComment]);
      fireCoreEvent('annotationChanged', [addedComment], 'add', {});

      expect(core.selectAnnotation).toHaveBeenCalledWith(addedComment, 1);
    });

    it('should not open the popup while the spreadsheet comment panel is open', () => {
      renderHook(() => useOnInlineCommentPopupOpen(), {
        wrapper: createWrapper({
          viewer: {
            ...spreadsheetViewer,
            openElements: { [DataElements.SPREADSHEET_EDITOR_COMMENT_PANEL]: true },
          },
        }),
      });
      act(() => onAnnotationSelectedHandler([createSpreadsheetComment()], 'selected'));

      expect(mockDispatch).not.toHaveBeenCalledWith(actions.openElement(DataElements.INLINE_COMMENT_POPUP));
    });

    it('should keep the selected comment while the comment panel blocks the popup, so the popup can open for it later', () => {
      const comment = createSpreadsheetComment();
      const { result } = renderHook(() => useOnInlineCommentPopupOpen(), {
        wrapper: createWrapper({
          viewer: {
            ...spreadsheetViewer,
            openElements: { [DataElements.SPREADSHEET_EDITOR_COMMENT_PANEL]: true },
          },
        }),
      });

      act(() => onAnnotationSelectedHandler([comment], 'selected'));

      expect(mockDispatch).toHaveBeenCalledWith(actions.closeElement(DataElements.INLINE_COMMENT_POPUP));
      expect(result.current.annotation).toBe(comment);
    });

    it('should not open the popup when the comment panel closes, only once the cell is selected again', () => {
      const sheet = document.createElement('div');
      document.body.appendChild(sheet);
      core.getViewerElement = jest.fn(() => sheet);
      const initialState = {
        viewer: {
          activeDocumentViewerKey: 1,
          disabledElements: {},
          openElements: {},
          inlineCommentFilter: () => true,
          isSpreadsheetEditorModeEnabled: true,
        },
        featureFlags: {},
        spreadsheetEditor: { cellProperties: { topLeftRow: null, topLeftColumn: null } },
      };
      const store = configureStore({
        reducer: (state = initialState, action) => (action.type === 'SET_COMMENT_PANEL_OPEN'
          ? { ...state, viewer: { ...state.viewer, openElements: { [DataElements.SPREADSHEET_EDITOR_COMMENT_PANEL]: action.payload } } }
          : state),
      });
      const setCommentPanelOpen = (isOpen) => act(() => {
        store.dispatch({ type: 'SET_COMMENT_PANEL_OPEN', payload: isOpen });
      });
      renderHook(() => useOnInlineCommentPopupOpen(), {
        wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
      });
      act(() => onAnnotationSelectedHandler([createSpreadsheetComment()], 'selected'));
      setCommentPanelOpen(true);
      mockDispatch.mockClear();

      setCommentPanelOpen(false);
      expect(mockDispatch).not.toHaveBeenCalledWith(actions.openElement(DataElements.INLINE_COMMENT_POPUP));

      act(() => {
        sheet.dispatchEvent(new Event('pointerdown', { bubbles: true, composed: true }));
        sheet.dispatchEvent(new Event('pointerup', { bubbles: true, composed: true }));
      });
      sheet.remove();

      expect(mockDispatch).toHaveBeenCalledWith(actions.openElement(DataElements.INLINE_COMMENT_POPUP));
    });

    it('should select the comment on the active cell so the popup can open for it', () => {
      const comment = createSpreadsheetComment({ row: 2, column: 3 });
      core.getAnnotationsList.mockReturnValue([createSpreadsheetComment({ id: 'other', row: 0, column: 0 }), comment]);

      renderHook(() => useOnInlineCommentPopupOpen(), {
        wrapper: createWrapper({ viewer: spreadsheetViewer, topLeftRow: 2, topLeftColumn: 3 }),
      });

      expect(core.selectAnnotation).toHaveBeenCalledWith(comment, 1);
    });

    it('should not select a comment when the active cell has none', () => {
      core.getAnnotationsList.mockReturnValue([createSpreadsheetComment({ row: 5, column: 5 })]);

      renderHook(() => useOnInlineCommentPopupOpen(), {
        wrapper: createWrapper({ viewer: spreadsheetViewer, topLeftRow: 2, topLeftColumn: 3 }),
      });

      expect(core.selectAnnotation).not.toHaveBeenCalled();
    });

    it('should ignore reply annotations when looking up the comment for the active cell', () => {
      core.getAnnotationsList.mockReturnValue([createSpreadsheetComment({ id: 'reply', row: 2, column: 3, listable: false })]);

      renderHook(() => useOnInlineCommentPopupOpen(), {
        wrapper: createWrapper({ viewer: spreadsheetViewer, topLeftRow: 2, topLeftColumn: 3 }),
      });

      expect(core.selectAnnotation).not.toHaveBeenCalled();
    });

    it('should not select cell comments outside the spreadsheet editor', () => {
      core.getAnnotationsList.mockReturnValue([createSpreadsheetComment({ row: 2, column: 3 })]);

      renderHook(() => useOnInlineCommentPopupOpen(), {
        wrapper: createWrapper({ topLeftRow: 2, topLeftColumn: 3 }),
      });

      expect(core.selectAnnotation).not.toHaveBeenCalled();
    });
  });
});
