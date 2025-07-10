import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import core from 'core';
import FormulaBarContainer from './FormulaBarContainer';
import initialState from 'src/redux/initialState';


const mockState = {
  ...initialState,
  spreadsheetEditor: {
    ...initialState.spreadsheetEditor,
    activeCellRange: 'A2:B2',
  },
};

const FormulaBarDefaultComponent = withProviders(FormulaBarContainer, mockState);

jest.mock('core', () => ({
  ...jest.requireActual('core'),
  getCellRange: jest.fn(),
  getDocumentViewer: jest.fn(() => ({
    getDocument: jest.fn(() => ({
      getSpreadsheetEditorDocument: jest.fn(() => ({
        selectCellRange: jest.fn(),
      })),
    })),
    getSpreadsheetEditorManager: jest.fn(() => ({
      getFormulaBarProvider: jest.fn(),
    })),
  })),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));


describe('Formula Bar Range Input Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('When I enter a valid range the UI reflects it', async () => {
    render(<FormulaBarDefaultComponent />);

    const getCellRangeSpy = jest.spyOn(core, 'getCellRange');
    const rangeInput = screen.getByRole('textbox', { name: 'Range' });
    userEvent.clear(rangeInput);
    userEvent.type(rangeInput, 'A2:B2');
    userEvent.type(rangeInput, '{enter}');
    expect(getCellRangeSpy).toHaveBeenCalledTimes(1);
    expect(getCellRangeSpy).toHaveBeenCalledWith('A2:B2');
    expect(rangeInput).toHaveValue('A2:B2');
  });

  it('When I enter an invalid range, the UI does not update and an error is throw by the API', async () => {
    render(<FormulaBarDefaultComponent />);

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
    const getCellRangeSpy = jest.spyOn(core, 'getCellRange').mockImplementation(() => {
      throw new Error('Invalid range format');
    });

    const selectCellRangeMock = jest.spyOn(core.getDocumentViewer().getDocument().getSpreadsheetEditorDocument(), 'selectCellRange');

    const rangeInput = screen.getByRole('textbox', { name: 'Range' });

    userEvent.clear(rangeInput);
    userEvent.type(rangeInput, 'A-22:B2');
    userEvent.type(rangeInput, '{enter}');

    expect(selectCellRangeMock).not.toHaveBeenCalled();
    expect(getCellRangeSpy).toHaveBeenCalledTimes(1);
    expect(getCellRangeSpy).toHaveBeenCalledWith('A-22:B2');
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(rangeInput).toHaveValue('A2:B2');
  });
});
