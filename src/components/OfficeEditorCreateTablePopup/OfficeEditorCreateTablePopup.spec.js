import React from 'react';
import OfficeEditorCreateTablePopup from './OfficeEditorCreateTablePopup';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen, within, fireEvent, waitFor } from '@testing-library/react';
import rootReducer from 'reducers/rootReducer';
import { Provider } from 'react-redux';
import useCore from 'hooks/useCore';

jest.mock('hooks/useCore');

describe('OfficeEditorCreateTablePopup', () => {
  const EXPECTED_ROWS = 10;
  const EXPECTED_COLUMNS = 10;

  const SAMPLE_COLUMN = 3;
  const SAMPLE_ROW = 2;
  const SAMPLE_LABEL = `${SAMPLE_COLUMN}x${SAMPLE_ROW} Table`;
  const SAMPLE_LABEL_NEXT_COLUMN = `${SAMPLE_COLUMN + 1}x${SAMPLE_ROW} Table`;
  const SAMPLE_LABEL_NEXT_ROW = `${SAMPLE_COLUMN}x${SAMPLE_ROW + 1} Table`;

  const EXPECTED_WIDTH = 100;
  const EXPECTED_UNIT = 'percent';

  let store;
  let insertTableAtCursor;
  let onClose;

  beforeEach(() => {
    store = configureStore({ reducer: rootReducer() });
    insertTableAtCursor = jest.fn().mockResolvedValue(undefined);
    onClose = jest.fn();
    useCore.mockReturnValue({
      core: {
        getOfficeEditor: () => ({ insertTableAtCursor }),
      },
      documentViewer: {},
    });
  });

  it('should render the correct number of rows and columns', () => {
    render(
      <Provider store={store}>
        <OfficeEditorCreateTablePopup />
      </Provider>
    );

    const rows = screen.getAllByRole('row');
    expect(rows.length).toBe(EXPECTED_ROWS);
    for (const row of rows) {
      const cells = within(row).getAllByRole('gridcell');
      expect(cells.length).toBe(EXPECTED_COLUMNS);
    }
  });

  it('should be navigable with keyboard', () => {
    render(
      <Provider store={store}>
        <OfficeEditorCreateTablePopup />
      </Provider>
    );

    // While the table is 1-indexed for the user, the array of cells here is 0-indexed
    const cells = screen.getAllByRole('gridcell');
    const cellAt = (rowIndex, colIndex) => cells[rowIndex * EXPECTED_COLUMNS + colIndex];

    const firstRowFirstColumn = cellAt(0, 0);
    firstRowFirstColumn.focus();
    expect(firstRowFirstColumn).toHaveFocus();

    // Simulate arrow key navigation
    fireEvent.keyDown(firstRowFirstColumn, { key: 'ArrowRight' });
    expect(cellAt(0, 1)).toHaveFocus();

    fireEvent.keyDown(cellAt(0, 1), { key: 'ArrowDown' });
    expect(cellAt(1, 1)).toHaveFocus();

    fireEvent.keyDown(cellAt(1, 1), { key: 'ArrowLeft' });
    expect(cellAt(1, 0)).toHaveFocus();

    fireEvent.keyDown(cellAt(1, 0), { key: 'ArrowUp' });
    expect(cellAt(0, 0)).toHaveFocus();


    // Overflow navigation
    fireEvent.keyDown(cellAt(0, 0), { key: 'ArrowLeft' });
    expect(cellAt(0, EXPECTED_COLUMNS - 1)).toHaveFocus();

    fireEvent.keyDown(cellAt(0, EXPECTED_COLUMNS - 1), { key: 'ArrowUp' });
    expect(cellAt(EXPECTED_ROWS - 1, EXPECTED_COLUMNS - 1)).toHaveFocus();

    fireEvent.keyDown(cellAt(EXPECTED_ROWS - 1, EXPECTED_COLUMNS - 1), { key: 'ArrowRight' });
    expect(cellAt(EXPECTED_ROWS - 1, 0)).toHaveFocus();

    fireEvent.keyDown(cellAt(EXPECTED_ROWS - 1, 0), { key: 'ArrowDown' });
    expect(cellAt(0, 0)).toHaveFocus();
  });

  it('should highlight all cells within the selected range', () => {
    render(
      <Provider store={store}>
        <OfficeEditorCreateTablePopup />
      </Provider>
    );
    const selectedCell = screen.getByLabelText(SAMPLE_LABEL);
    fireEvent.mouseEnter(selectedCell);
    expect(selectedCell).toHaveAttribute('aria-selected', 'true');

    for (let col = 1; col <= SAMPLE_COLUMN; col++) {
      for (let row = 1; row <= SAMPLE_ROW; row++) {
        expect(screen.getByLabelText(`${col}x${row} Table`)).toHaveClass('highlighted-cell');
      }
    }

    // cells outside the range are not highlighted
    expect(screen.getByLabelText(SAMPLE_LABEL_NEXT_COLUMN)).not.toHaveClass('highlighted-cell');
    expect(screen.getByLabelText(SAMPLE_LABEL_NEXT_COLUMN)).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByLabelText(SAMPLE_LABEL_NEXT_ROW)).not.toHaveClass('highlighted-cell');
    expect(screen.getByLabelText(SAMPLE_LABEL_NEXT_ROW)).toHaveAttribute('aria-selected', 'false');
  });

  it('should create a table with the selected dimensions and close when Enter is pressed', async () => {
    render(
      <Provider store={store}>
        <OfficeEditorCreateTablePopup onClose={onClose} />
      </Provider>
    );
    const selectedCell = screen.getByLabelText(SAMPLE_LABEL);
    fireEvent.mouseEnter(selectedCell);
    selectedCell.focus();
    expect(selectedCell).toHaveFocus();
    fireEvent.keyDown(selectedCell, { key: 'Enter' });

    expect(insertTableAtCursor).toHaveBeenCalledWith(SAMPLE_ROW, SAMPLE_COLUMN, EXPECTED_WIDTH, EXPECTED_UNIT);
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it('should create a table with the clicked cell dimensions and close on click', async () => {
    render(
      <Provider store={store}>
        <OfficeEditorCreateTablePopup onClose={onClose} />
      </Provider>
    );
    const selectedCell = screen.getByLabelText(SAMPLE_LABEL);
    fireEvent.click(selectedCell);

    expect(insertTableAtCursor).toHaveBeenCalledWith(SAMPLE_ROW, SAMPLE_COLUMN, EXPECTED_WIDTH, EXPECTED_UNIT);
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it('should close the popup when Escape is pressed', () => {
    render(
      <Provider store={store}>
        <OfficeEditorCreateTablePopup onClose={onClose} />
      </Provider>
    );
    const selectedCell = screen.getByLabelText(SAMPLE_LABEL);
    selectedCell.focus();
    expect(selectedCell).toHaveFocus();
    fireEvent.keyDown(selectedCell, { key: 'Escape' });

    expect(onClose).toHaveBeenCalled();
    expect(insertTableAtCursor).not.toHaveBeenCalled();
  });

  it('should reset the selection to the first cell when the popup is closed', () => {
    const firstCellLabel = '1x1 Table';
    const { rerender } = render(
      <Provider store={store}>
        <OfficeEditorCreateTablePopup isOpen onClose={onClose} />
      </Provider>
    );

    // move the selection away from the first cell
    fireEvent.mouseEnter(screen.getByLabelText(SAMPLE_LABEL));
    expect(screen.getByLabelText(SAMPLE_LABEL)).toHaveAttribute('aria-selected', 'true');

    // closing the popup should reset the selection back to the first cell
    rerender(
      <Provider store={store}>
        <OfficeEditorCreateTablePopup isOpen={false} onClose={onClose} />
      </Provider>
    );

    expect(screen.getByLabelText(firstCellLabel)).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByLabelText(SAMPLE_LABEL)).toHaveAttribute('aria-selected', 'false');
  });
});
