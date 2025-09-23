import { fireEvent, screen } from '@testing-library/react';
import UndoButton from './Undo';
import RedoButton from './Redo';
import core from 'core';
import {
  renderWithRedux,
  getSpreadsheetEditorState
} from './UndoRedoTestHelpers';

jest.mock('core');

jest.mock('src/helpers/undoRedoSpreadsheetHelpers', () => ({
  triggerSelectedRangeStyleChangedWithLatestStyle: jest.fn(),
}));

const buttonTestConfig = [
  {
    name: 'UndoButton',
    Component: UndoButton,
    buttonLabel: 'Undo',
    canPerformAction: 'canUndo',
    historyManagerMethod: 'undo',
    spreadsheetEditorState: {
      enabled: getSpreadsheetEditorState(true, false),
      disabled: getSpreadsheetEditorState(false, false),
    }
  },
  {
    name: 'RedoButton',
    Component: RedoButton,
    buttonLabel: 'Redo',
    canPerformAction: 'canRedo',
    historyManagerMethod: 'redo',
    spreadsheetEditorState: {
      enabled: getSpreadsheetEditorState(false, true),
      disabled: getSpreadsheetEditorState(false, false),
    }
  }
];

describe('UndoRedo Buttons', () => {
  let mockSpreadsheetHistoryManager;
  let mockSpreadsheetEditorManager;
  let mockDocumentViewer;
  let mockOfficeEditor;
  let mockAnnotationHistoryManager;
  let mockDocument;

  beforeEach(() => {
    jest.clearAllMocks();

    mockSpreadsheetHistoryManager = {
      undo: jest.fn(),
      redo: jest.fn(),
      canUndo: jest.fn(),
      canRedo: jest.fn(),
    };

    mockSpreadsheetEditorManager = {
      getSpreadsheetEditorHistoryManager: jest.fn(() => mockSpreadsheetHistoryManager),
      trigger: jest.fn(),
      getSelectedCells: jest.fn(() => []),
    };

    mockAnnotationHistoryManager = {
      undo: jest.fn(),
      redo: jest.fn(),
    };

    mockDocument = {
      getOfficeEditor: jest.fn(() => mockOfficeEditor),
    };

    mockDocumentViewer = {
      getSpreadsheetEditorManager: jest.fn(() => mockSpreadsheetEditorManager),
      getAnnotationHistoryManager: jest.fn(() => mockAnnotationHistoryManager),
      getDocument: jest.fn(() => mockDocument),
    };

    mockOfficeEditor = {
      undo: jest.fn(),
      redo: jest.fn(),
    };

    core.undo = jest.fn();
    core.redo = jest.fn();
    core.getDocumentViewer = jest.fn(() => mockDocumentViewer);
    core.getOfficeEditor = jest.fn(() => mockOfficeEditor);
  });

  describe.each(buttonTestConfig)('$name', ({
    Component,
    buttonLabel,
    canPerformAction,
    historyManagerMethod,
    spreadsheetEditorState
  }) => {
    describe('in spreadsheet editor mode', () => {
      it(`should be enabled when ${canPerformAction} is true`, () => {
        renderWithRedux(Component, {}, spreadsheetEditorState.enabled);
        const button = screen.getByRole('button', { name: buttonLabel });

        expect(button).not.toBeDisabled();
      });

      it(`should be disabled when ${canPerformAction} is false`, () => {
        renderWithRedux(Component, {}, spreadsheetEditorState.disabled);
        const button = screen.getByRole('button', { name: buttonLabel });

        expect(button).toBeDisabled();
      });

      it(`should call spreadsheet editor ${historyManagerMethod} when clicked`, () => {
        renderWithRedux(Component, {}, spreadsheetEditorState.enabled);
        const button = screen.getByRole('button', { name: buttonLabel });
        fireEvent.click(button);

        expect(mockSpreadsheetHistoryManager[historyManagerMethod]).toHaveBeenCalledTimes(1);
      });
    });

    describe('in office editor mode', () => {
      const officeEditorState = {
        viewer: {
          uiConfiguration: 'officeEditor',
          activeDocumentViewerKey: 1,
          canUndo: { 1: true },
          canRedo: { 1: true },
          disabledElements: {},
          customElementOverrides: {},
          isOfficeEditorMode: true,
        },
        officeEditor: {
          canUndo: true,
          canRedo: true,
        },
      };

      it('should be enabled when office editor action is enabled', () => {
        renderWithRedux(Component, {}, officeEditorState);
        const button = screen.getByRole('button', { name: buttonLabel });

        expect(button).not.toBeDisabled();
      });

      it('should be disabled when office editor action is disabled', () => {
        const disabledOfficeEditorState = {
          ...officeEditorState,
          officeEditor: {
            canUndo: false,
            canRedo: false,
          },
        };
        renderWithRedux(Component, {}, disabledOfficeEditorState);
        const button = screen.getByRole('button', { name: buttonLabel });
        expect(button).toBeDisabled();
      });

      it(`should call office editor ${historyManagerMethod} when clicked`, () => {
        renderWithRedux(Component, {}, officeEditorState);
        const button = screen.getByRole('button', { name: buttonLabel });

        fireEvent.click(button);

        expect(mockOfficeEditor[historyManagerMethod]).toHaveBeenCalledTimes(1);
      });
    });

    describe('in pdf viewer mode', () => {
      it('should be enabled when canPerformAction is true', () => {
        const regularViewerState = {
          viewer: {
            uiConfiguration: 'default',
            activeDocumentViewerKey: 1,
            canUndo: { 1: true },
            canRedo: { 1: true },
            disabledElements: {},
            customElementOverrides: {},
          },
        };

        renderWithRedux(Component, {}, regularViewerState);
        const button = screen.getByRole('button', { name: buttonLabel });

        expect(button).not.toBeDisabled();
      });

      it('should be disabled when canPerformAction is false', () => {
        const regularViewerState = {
          viewer: {
            uiConfiguration: 'default',
            activeDocumentViewerKey: 1,
            canUndo: { 1: false },
            canRedo: { 1: false },
            disabledElements: {},
            customElementOverrides: {},
          },
        };

        renderWithRedux(Component, {}, regularViewerState);
        const button = screen.getByRole('button', { name: buttonLabel });

        expect(button).toBeDisabled();
      });

      it(`should call core.${historyManagerMethod} when clicked`, () => {
        const regularViewerState = {
          viewer: {
            uiConfiguration: 'default',
            activeDocumentViewerKey: 1,
            canUndo: { 1: historyManagerMethod === 'undo' },
            canRedo: { 1: historyManagerMethod === 'redo' },
            disabledElements: {},
            customElementOverrides: {},
          },
        };

        core[historyManagerMethod] = jest.fn();

        renderWithRedux(Component, {}, regularViewerState);
        const button = screen.getByRole('button', { name: buttonLabel });
        fireEvent.click(button);

        expect(core[historyManagerMethod]).toHaveBeenCalledTimes(1);
      });
    });
  });
});
