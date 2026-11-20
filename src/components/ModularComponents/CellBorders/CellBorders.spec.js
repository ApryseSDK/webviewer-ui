import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import rootReducer from 'src/redux/reducers/rootReducer';
import core from 'core';
import CellBorders from './CellBorders';

jest.mock('core');

describe('CellBorders', () => {
  let mockSpreadsheetEditorManager;

  beforeEach(() => {
    mockSpreadsheetEditorManager = {
      getSelectedCells: jest.fn(() => [{}]),
      getSelectedCellRange: jest.fn(() => ({ firstRow: 0, lastRow: 0, firstColumn: 0, lastColumn: 0 })),
    };
    core.getDocumentViewer = jest.fn(() => ({
      getSpreadsheetEditorManager: jest.fn(() => mockSpreadsheetEditorManager),
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  function renderWithStore(preloadedState) {
    const store = configureStore({ reducer: rootReducer(), preloadedState });
    return render(
      <Provider store={store}>
        <CellBorders isFlyoutItem dataElement="cellBorderButtons" />
      </Provider>
    );
  }

  it('should mark the border button matching the active border style as active for a single cell', () => {
    const { getByRole } = renderWithStore({
      spreadsheetEditor: {
        ...rootReducer()(undefined, {}).spreadsheetEditor,
        cellProperties: {
          ...rootReducer()(undefined, {}).spreadsheetEditor.cellProperties,
          isSingleCell: true,
          styles: {
            ...rootReducer()(undefined, {}).spreadsheetEditor.cellProperties.styles,
            border: { top: { style: 'Solid' }, left: null, right: null, bottom: null },
          },
        },
      },
    });

    const topButton = getByRole('button', { name: 'Top Border' });
    expect(topButton).toHaveClass('active');
    expect(topButton).toHaveClass('border-button');
    expect(topButton).not.toHaveClass('PresetButton');

    const leftButton = getByRole('button', { name: 'Left Border' });
    expect(leftButton).not.toHaveClass('active');
  });

  it('should never mark border buttons active when the selection is not a single cell', () => {
    const { getByRole } = renderWithStore({
      spreadsheetEditor: {
        ...rootReducer()(undefined, {}).spreadsheetEditor,
        cellProperties: {
          ...rootReducer()(undefined, {}).spreadsheetEditor.cellProperties,
          isSingleCell: false,
          styles: {
            ...rootReducer()(undefined, {}).spreadsheetEditor.cellProperties.styles,
            border: { top: { style: 'Solid' }, left: null, right: null, bottom: null },
          },
        },
      },
    });

    const topButton = getByRole('button', { name: 'Top Border' });
    expect(topButton).not.toHaveClass('active');
  });
});
