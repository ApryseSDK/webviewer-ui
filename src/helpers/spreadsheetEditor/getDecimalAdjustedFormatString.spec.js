import { getDecimalAdjustedFormatString } from './getDecimalAdjustedFormatString';
import core from 'core';

jest.mock('core');

describe('getDecimalAdjustedFormatString', () => {
  const cellStyle = { getDataFormatString: jest.fn() };
  const cell = { getStyle: jest.fn(), numericCellValue: 123 };

  beforeEach(() => {
    cell.getStyle.mockReturnValue(cellStyle);
    cell.numericCellValue = 123;
    core.getDocumentViewer.mockReturnValue({
      getSpreadsheetEditorManager: () => ({ getSelectedCells: () => [cell] }),
    });
  });

  it.each([
    ['0.00', 'increaseDecimalFormat', '0.000'],
    ['0.000', 'decreaseDecimalFormat', '0.00'],
    ['#,##0.00;(#,##0.00)', 'increaseDecimalFormat', '#,##0.000;(#,##0.000)'],
  ])('adjusts %s with %s', (formatString, action, expected) => {
    cellStyle.getDataFormatString.mockReturnValue(formatString);
    expect(getDecimalAdjustedFormatString(action)).toBe(expected);
  });

  it('returns undefined without a cell style', () => {
    cell.getStyle.mockReturnValue(null);
    expect(getDecimalAdjustedFormatString('increaseDecimalFormat')).toBeUndefined();
  });

  it.each([[42, '#0.0'], [NaN, 'General']])('handles General for numeric value %p', (numericValue, expected) => {
    cell.numericCellValue = numericValue;
    cellStyle.getDataFormatString.mockReturnValue('General');
    expect(getDecimalAdjustedFormatString('increaseDecimalFormat')).toBe(expected);
  });
});
