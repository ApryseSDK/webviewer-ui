import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import SpreadsheetEditorEditModeDropdown from './SpreadsheetEditorEditModeDropdown';
import * as reactRedux from 'react-redux';
import selectors from 'selectors';

const mockSetEditMode = jest.fn();

jest.mock('core', () => ({
  getDocumentViewer: jest.fn(() => ({
    getSpreadsheetEditorManager: jest.fn(() => ({
      setEditMode: mockSetEditMode,
    })),
  })),
  getScrollViewElement: jest.fn(() => ({
    getBoundingClientRect: jest.fn(() => ({
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    }))
  }))
}));

jest.mock('selectors', () => ({
  getActiveFlyout: jest.fn(),
  getSpreadsheetEditorEditMode: jest.fn(),
}));

const store = configureStore({
  reducer: () => ({})
});

describe('SpreadsheetEditorEditModeDropdown', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    selectors.getActiveFlyout.mockReturnValue(null);
    selectors.getSpreadsheetEditorEditMode.mockReturnValue('editing');

    jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(jest.fn());
  });

  it('should call setEditMode with the correct mode when selecting items from dropdown', () => {
    render(
      <Provider store={store}>
        <SpreadsheetEditorEditModeDropdown />
      </Provider>
    );

    const toggleButton = screen.getByRole('combobox', { name: 'Edit mode selection' });
    userEvent.click(toggleButton);
    const viewOnlyModeButton = screen.getByRole('option', { name: /Viewing View only/i });
    userEvent.click(viewOnlyModeButton);
    expect(mockSetEditMode).toHaveBeenCalledWith('viewOnly');

    mockSetEditMode.mockClear();

    userEvent.click(toggleButton);
    const editModeButton = screen.getByRole('option', { name: /Editing/i });
    userEvent.click(editModeButton);
    expect(mockSetEditMode).toHaveBeenCalledWith('editing');
  });
});