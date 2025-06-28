import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormulaBar from './FormulaBar';
import core from 'core';

const mockProvider = {
  onFormulaBarTextChange: jest.fn(),
  onFormulaBarSelectionChanged: jest.fn(),
  onFormulaBarFocus: jest.fn(),
  onFormulaBarKeyDown: jest.fn(),
};

jest.mock('core', () => ({
  getDocumentViewer: jest.fn(() => ({
    getSpreadsheetEditorManager: jest.fn(() => ({
      getFormulaBarProvider: jest.fn(() => mockProvider),
    })),
  })),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

describe('FormulaBar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(
      <FormulaBar
        isReadOnly={false}
        activeCellRange="A1"
        cellFormula=""
        stringCellValue=""
        onRangeInputChange={jest.fn()}
        onRangeInputKeyDown={jest.fn()}
      />
    );
    // Trigger 'spreadsheetEditorReady' to set up the Provider
    const handler = core.addEventListener.mock.calls.find(
      ([eventName]) => eventName === 'spreadsheetEditorReady'
    )?.[1];
    if (handler) {
      handler();
    } else {
      throw new Error('spreadsheetEditorReady handler not registered');
    }
  });

  it('calls onFormulaBarFocus when the formula input is focused', async () => {
    const formulaInput = screen.getByRole('combobox', { name: 'Formula Bar' });
    await userEvent.click(formulaInput);
    expect(mockProvider.onFormulaBarFocus).toHaveBeenCalled();
  });

  it('calls onFormulaBarTextChange when the formula input changes', async () => {
    const formulaInput = screen.getByRole('combobox', { name: 'Formula Bar' });
    await userEvent.clear(formulaInput);
    await userEvent.type(formulaInput, '=SUM');
    expect(mockProvider.onFormulaBarTextChange).toHaveBeenCalledWith('=SUM');
  });

  it('calls onFormulaBarKeyDown when a key is pressed in the formula input', async () => {
    const formulaInput = screen.getByRole('combobox', { name: 'Formula Bar' });
    await userEvent.click(formulaInput);
    await userEvent.type(formulaInput, '=');
    expect(mockProvider.onFormulaBarKeyDown).toHaveBeenCalled();
  });

  it('calls onFormulaBarSelectionChanged when the selection changes in the formula input', async () => {
    const formulaInput = screen.getByRole('combobox', { name: 'Formula Bar' });
    await userEvent.click(formulaInput);
    formulaInput.setSelectionRange(0, 2);
    await userEvent.type(formulaInput, '=sum');
    formulaInput.dispatchEvent(new Event('select', { bubbles: true }));
    expect(mockProvider.onFormulaBarSelectionChanged).toHaveBeenCalled();
  });
});

