import setCellFormatString from './setCellFormatString';
import core from 'core';
import { getDecimalAdjustedFormatString } from './getDecimalAdjustedFormatString';

jest.mock('core');
jest.mock('src/constants/spreadsheetEditor', () => ({
  formatsMap: {
    accounting: '_($* #,##0.00_);_($* (#,##0.00);',
    financial: '#,##0.00;(#,##0.00)',
    percentage: '0.00%',
    empty: null,
  },
}));
jest.mock('./getDecimalAdjustedFormatString');

describe('setCellFormatString', () => {
  const setSelectedCellsStyle = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    core.getDocumentViewer.mockReturnValue({
      getSpreadsheetEditorManager: () => ({ setSelectedCellsStyle }),
    });
  });

  it.each([
    ['accounting', '_($* #,##0.00_);_($* (#,##0.00);'],
    ['financial', '#,##0.00;(#,##0.00)'],
    ['percentage', '0.00%'],
  ])('applies the %s format', (formatType, formatString) => {
    setCellFormatString(formatType);
    expect(setSelectedCellsStyle).toHaveBeenCalledWith({ formatString });
  });

  it('applies a decimal adjustment', () => {
    getDecimalAdjustedFormatString.mockReturnValue('0.000');
    setCellFormatString('increaseDecimalFormat');
    expect(getDecimalAdjustedFormatString).toHaveBeenCalledWith('increaseDecimalFormat');
    expect(setSelectedCellsStyle).toHaveBeenCalledWith({ formatString: '0.000' });
  });

  it.each(['unknownFormat', 'empty', 'increaseDecimalFormat'])('does not apply an unavailable %s format', (formatType) => {
    getDecimalAdjustedFormatString.mockReturnValue(undefined);
    setCellFormatString(formatType);
    expect(setSelectedCellsStyle).not.toHaveBeenCalled();
  });
});
