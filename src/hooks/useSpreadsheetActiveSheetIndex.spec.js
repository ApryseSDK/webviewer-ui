import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import useCore from 'hooks/useCore';
import useSpreadsheetActiveSheetIndex from './useSpreadsheetActiveSheetIndex';

jest.mock('hooks/useCore', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// eslint-disable-next-line react/prop-types
const MockComponent = ({ children }) => (<div>{children}</div>);
const wrapper = withProviders(MockComponent);

describe('useSpreadsheetActiveSheetIndex', () => {
  let eventHandlers;
  let mockWorkbook;
  let core;

  beforeEach(() => {
    eventHandlers = {};
    core = {
      addEventListener: jest.fn((event, handler) => {
        eventHandlers[event] = handler;
      }),
      removeEventListener: jest.fn((event, handler) => {
        if (eventHandlers[event] === handler) {
          delete eventHandlers[event];
        }
      }),
    };

    mockWorkbook = { activeSheetIndex: 0 };
    core.getDocumentViewer = jest.fn(() => ({
      getSpreadsheetEditorManager: jest.fn(() => ({
        getWorkbook: jest.fn(() => mockWorkbook),
      })),
    }));

    useCore.mockReturnValue({ core });
  });

  it('stays at 0 and does not subscribe to core events when not in Spreadsheet Editor mode', () => {
    const { result } = renderHook(() => useSpreadsheetActiveSheetIndex(false), { wrapper });

    expect(result.current).toBe(0);
    expect(core.addEventListener).not.toHaveBeenCalled();
  });

  it('stays at 0 when the spreadsheet editor manager is not yet available', () => {
    core.getDocumentViewer = jest.fn(() => ({
      getSpreadsheetEditorManager: jest.fn(() => undefined),
    }));

    const { result } = renderHook(() => useSpreadsheetActiveSheetIndex(true), { wrapper });

    expect(result.current).toBe(0);
    expect(core.addEventListener).not.toHaveBeenCalled();
  });

  it('initializes from the workbook active sheet index on mount', () => {
    mockWorkbook.activeSheetIndex = 2;

    const { result } = renderHook(() => useSpreadsheetActiveSheetIndex(true), { wrapper });

    expect(result.current).toBe(2);
  });

  it('updates when core emits activeSheetChanged', () => {
    const { result } = renderHook(() => useSpreadsheetActiveSheetIndex(true), { wrapper });

    act(() => {
      eventHandlers.activeSheetChanged({ getSheetIndex: () => 3 });
    });

    expect(result.current).toBe(3);
  });

  it('updates when core emits spreadsheetEditorReady', () => {
    const { result } = renderHook(() => useSpreadsheetActiveSheetIndex(true), { wrapper });

    mockWorkbook.activeSheetIndex = 4;
    act(() => {
      eventHandlers.spreadsheetEditorReady();
    });

    expect(result.current).toBe(4);
  });

  it('removes its core event listeners on unmount', () => {
    const { unmount } = renderHook(() => useSpreadsheetActiveSheetIndex(true), { wrapper });
    const activeSheetChangedHandler = eventHandlers.activeSheetChanged;
    const spreadsheetEditorReadyHandler = eventHandlers.spreadsheetEditorReady;

    unmount();

    expect(core.removeEventListener).toHaveBeenCalledWith('activeSheetChanged', activeSheetChangedHandler);
    expect(core.removeEventListener).toHaveBeenCalledWith('spreadsheetEditorReady', spreadsheetEditorReadyHandler);
  });
});
