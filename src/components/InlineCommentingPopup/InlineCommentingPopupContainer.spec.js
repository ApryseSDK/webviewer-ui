import React from 'react';
import { render } from '@testing-library/react';
import InlineCommentingPopupContainer from './InlineCommentingPopupContainer';
import useOnClickOutside from 'hooks/useOnClickOutside';
import actions from 'actions';
import DataElements from 'constants/dataElement';
import { useDispatch, useSelector } from 'react-redux';

jest.mock('hooks/useOnClickOutside', () => jest.fn());

jest.mock('hooks/useCore', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('./InlineCommentingPopup', () => jest.fn(() => null));

jest.mock('./InlineCommentingOfficeEditorPopupContainer', () => jest.fn(() => null));

jest.mock('./InlineCommentingSpreadsheetEditorPopupContainer', () => jest.fn(() => null));

jest.mock('constants/map', () => ({
  annotationMapKeys: {
    OFFICE_EDITOR_COMMENT: 'officeEditorComment',
    TRACKED_CHANGE: 'trackedChange',
    SPREADSHEET_EDITOR_COMMENT: 'spreadsheetEditorComment',
  },
  mapAnnotationToKey: jest.fn(),
}));

jest.mock('actions', () => ({
  closeElement: jest.fn((element) => ({ type: 'CLOSE_ELEMENT', payload: element })),
}));

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
  shallowEqual: jest.fn(),
}));

const createAnnotation = (id = '123', customData = {}) => ({
  Id: id,
  getContents: () => '',
  getCustomData: (key) => customData[key] || '',
});

const renderPopup = (annotation) => {
  return render(
    <InlineCommentingPopupContainer
      annotation={annotation}
      closeAndReset={jest.fn()}
      lastAnnotationsUnderMouse={[]}
    />
  );
};

describe('InlineCommentingPopupContainer', () => {
  const dispatchMock = jest.fn();
  // Mock selector tuple so we can render without a Redux store; tests only need click-outside behavior.
  const selectorResult = [
    false, // isNotesPanelOpen
    false, // notesInLeftPanel
    false, // isLeftPanelOpen
    '', // activeLeftPanel
    false, // showAnnotationNumbering
    'position', // sortStrategy
    false, // isDocumentReadOnly
    1, // activeDocumentViewerKey
    false, // isOfficeEditorMode
    false, // isSpreadsheetEditorMode
  ];

  beforeEach(() => {
    dispatchMock.mockClear();
    useDispatch.mockReturnValue(dispatchMock);
    useSelector.mockReturnValue(selectorResult);
    require('hooks/useCore').default.mockReturnValue({
      core: {
        canModifyContents: () => true,
        getDocument: () => null,
      },
    });
    useOnClickOutside.mockClear();
    actions.closeElement.mockClear();
    require('constants/map').mapAnnotationToKey.mockImplementation((annotation) => (
      annotation.getCustomData('spreadsheetThreadId') ? 'spreadsheetEditorComment' : null
    ));
    document.body.innerHTML = '';
  });

  it('does not close when clicking note popup flyout items', () => {
    const annotation = createAnnotation('123');
    renderPopup(annotation);

    const flyout = document.createElement('div');
    flyout.setAttribute('data-element', 'notePopupFlyout-123-inlineCommentPopup');
    const flyoutItem = document.createElement('button');
    flyout.appendChild(flyoutItem);
    document.body.appendChild(flyout);

    const handler = useOnClickOutside.mock.calls[0][1];
    handler({ target: flyoutItem });

    expect(dispatchMock).not.toHaveBeenCalled();
    expect(actions.closeElement).not.toHaveBeenCalled();
  });

  it('does not close when clicking note state flyout items', () => {
    const annotation = createAnnotation('456');
    renderPopup(annotation);

    const flyout = document.createElement('div');
    flyout.setAttribute('data-element', 'noteStateFlyout-456-inlineCommentPopup');
    const flyoutItem = document.createElement('button');
    flyout.appendChild(flyoutItem);
    document.body.appendChild(flyout);

    const handler = useOnClickOutside.mock.calls[0][1];
    handler({ target: flyoutItem });

    expect(dispatchMock).not.toHaveBeenCalled();
    expect(actions.closeElement).not.toHaveBeenCalled();
  });

  describe('in the spreadsheet editor', () => {
    const viewerElement = document.createElement('div');
    const sheetCell = document.createElement('div');
    viewerElement.appendChild(sheetCell);

    beforeEach(() => {
      useSelector.mockReturnValue([...selectorResult.slice(0, -1), true]);
      require('hooks/useCore').default.mockReturnValue({
        core: {
          canModifyContents: () => true,
          getDocument: () => null,
          getViewerElement: () => viewerElement,
        },
      });
    });

    it('should not close when clicking the sheet, since the popup follows the selected cell', () => {
      renderPopup(createAnnotation('1', { spreadsheetThreadId: 'thread-1' }));

      const handler = useOnClickOutside.mock.calls[0][1];
      handler({ target: sheetCell, composedPath: () => [sheetCell, viewerElement] });

      expect(dispatchMock).not.toHaveBeenCalled();
    });

    it('should close when clicking outside both the popup and the sheet', () => {
      renderPopup(createAnnotation('1', { spreadsheetThreadId: 'thread-1' }));

      const handler = useOnClickOutside.mock.calls[0][1];
      handler({ target: document.body, composedPath: () => [document.body] });

      expect(dispatchMock).toHaveBeenCalledWith(actions.closeElement(DataElements.INLINE_COMMENT_POPUP));
    });

    it('should close the popup and return focus to the sheet, keeping the annotation so the cell can reopen it', () => {
      const closeAndReset = jest.fn();
      const mockSpreadsheetPopup = require('./InlineCommentingSpreadsheetEditorPopupContainer');
      mockSpreadsheetPopup.mockClear();
      const gridCanvas = document.createElement('canvas');
      gridCanvas.id = 'leadsheetTableContent';
      const gridTable = document.createElement('table');
      gridTable.tabIndex = -1;
      document.body.append(gridCanvas, gridTable);
      render(
        <InlineCommentingPopupContainer
          annotation={createAnnotation('1', { spreadsheetThreadId: 'thread-1' })}
          closeAndReset={closeAndReset}
          lastAnnotationsUnderMouse={[]}
        />
      );

      mockSpreadsheetPopup.mock.calls[0][0].closeAndReset();

      expect(dispatchMock).toHaveBeenCalledWith(actions.closeElement(DataElements.INLINE_COMMENT_POPUP));
      expect(document.activeElement).toBe(gridTable);
      expect(closeAndReset).not.toHaveBeenCalled();
      document.body.innerHTML = '';
    });
  });

  it('closes when clicking outside protected areas', () => {
    const annotation = createAnnotation('789');
    renderPopup(annotation);

    const handler = useOnClickOutside.mock.calls[0][1];
    handler({ target: document.body });

    expect(dispatchMock).toHaveBeenCalledWith(
      actions.closeElement(DataElements.INLINE_COMMENT_POPUP)
    );
  });

  it('renders the spreadsheet editor popup for spreadsheet comment annotations', () => {
    const mockSpreadsheetPopup = require('./InlineCommentingSpreadsheetEditorPopupContainer');
    mockSpreadsheetPopup.mockClear();
    renderPopup(createAnnotation('1', { spreadsheetThreadId: 'thread-1' }));

    expect(mockSpreadsheetPopup).toHaveBeenCalled();
  });

  it('passes correct context value for spreadsheet editor comments', () => {
    const mockSpreadsheetPopup = require('./InlineCommentingSpreadsheetEditorPopupContainer');
    mockSpreadsheetPopup.mockClear();
    const annotation = createAnnotation('1', { spreadsheetThreadId: 'thread-1' });
    renderPopup(annotation);

    const callArgs = mockSpreadsheetPopup.mock.calls[0][0];
    expect(callArgs.contextValue.isSpreadsheetEditorCommentAnnotation).toBe(true);
    expect(callArgs.contextValue.isOfficeEditorCommentAnnotation).toBe(false);
  });

  it('renders default inline commenting popup for non-office, non-spreadsheet annotations', () => {
    const mockPopup = require('./InlineCommentingPopup');
    const mockOfficePopup = require('./InlineCommentingOfficeEditorPopupContainer');
    const mockSpreadsheetPopup = require('./InlineCommentingSpreadsheetEditorPopupContainer');

    mockPopup.mockClear();
    mockOfficePopup.mockClear();
    mockSpreadsheetPopup.mockClear();

    const annotation = createAnnotation('default-popup');
    renderPopup(annotation);

    expect(mockPopup).toHaveBeenCalled();
    expect(mockOfficePopup).not.toHaveBeenCalled();
    expect(mockSpreadsheetPopup).not.toHaveBeenCalled();
  });
});
