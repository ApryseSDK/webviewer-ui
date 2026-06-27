import React from 'react';
import { act, render } from '@testing-library/react';
import SpreadsheetSwitcherContainer from './SpreadsheetSwitcherContainer';
import useCore from 'hooks/useCore';
import { useDispatch } from 'react-redux';

jest.mock('hooks/useCore', () => jest.fn());
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));
jest.mock('./SpreadsheetSwitcher', () => () => null);
jest.mock('actions', () => ({
  setSpreadsheetEditorCanUndo: jest.fn((canUndo) => ({
    type: 'SET_SPREADSHEET_EDITOR_CAN_UNDO',
    payload: { canUndo },
  })),
  setSpreadsheetEditorCanRedo: jest.fn((canRedo) => ({
    type: 'SET_SPREADSHEET_EDITOR_CAN_REDO',
    payload: { canRedo },
  })),
}));

describe('SpreadsheetSwitcherContainer', () => {
  const dispatch = jest.fn();
  const sheetChangedListener = jest.fn();
  const activeSheetChangedListener = jest.fn();
  const spreadsheetEditorReadyListener = jest.fn();
  const canUndo = jest.fn().mockReturnValue(true);
  const canRedo = jest.fn().mockReturnValue(false);

  const spreadsheetEditorHistoryManager = {
    canUndo,
    canRedo,
  };

  const core = {
    addEventListener: jest.fn((eventName, handler) => {
      if (eventName === 'sheetChanged') {
        sheetChangedListener.mockImplementation(handler);
      }
      if (eventName === 'activeSheetChanged') {
        activeSheetChangedListener.mockImplementation(handler);
      }
      if (eventName === 'spreadsheetEditorReady') {
        spreadsheetEditorReadyListener.mockImplementation(handler);
      }
    }),
    removeEventListener: jest.fn(),
    getDocumentViewer: jest.fn(() => ({
      getSpreadsheetEditorManager: jest.fn(() => ({
        getSpreadsheetEditorHistoryManager: jest.fn(() => spreadsheetEditorHistoryManager),
      })),
      getDocument: jest.fn(() => ({
        getSpreadsheetEditorDocument: jest.fn(() => ({
          getWorkbook: jest.fn(),
        })),
      })),
    })),
    getDocument: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useCore.mockReturnValue({ core });
    useDispatch.mockReturnValue(dispatch);
  });

  it('refreshes spreadsheet undo and redo state when sheetChanged fires', () => {
    render(<SpreadsheetSwitcherContainer />);

    expect(core.addEventListener).toHaveBeenCalledWith('sheetChanged', expect.any(Function));

    act(() => {
      sheetChangedListener({
        getVisibleSheets: () => ([{ name: 'Sheet1', sheetIndex: 0 }]),
        getActiveSheetIndex: () => 0,
      });
    });

    expect(canUndo).toHaveBeenCalledTimes(1);
    expect(canRedo).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_SPREADSHEET_EDITOR_CAN_UNDO',
      payload: { canUndo: true },
    });
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_SPREADSHEET_EDITOR_CAN_REDO',
      payload: { canRedo: false },
    });
  });
});