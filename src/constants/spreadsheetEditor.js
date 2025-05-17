export const SpreadsheetEditorEditMode = window.Core.SpreadsheetEditor.SpreadsheetEditorEditMode;

export const AVAILABLE_FONT_SIZES = ['8', '9', '10', '11', '12', '14', '18', '24', '30', '36', '48', '60', '72'];

export const CELL_ALIGNMENT_OPTIONS = {
  Left: 'left',
  Center: 'center',
  Right: 'right',
  Top: 'top',
  Middle: 'middle',
  Bottom: 'bottom',
};
export const CELL_ADJUSTMENT_OPTIONS = {
  ColumnLeft: 'columnLeft',
};

export const CELL_ACTION_OPTIONS = {
  Copy: 'copy',
  Paste: 'paste',
  Cut: 'cut',
};

export const checkIfArrayContains = (arr, val) => {
  return arr.some((item) => {
    return item === val;
  });
};

export const verticalAlignmentLabels = {
  1: 'top',
  2: 'middle',
  3: 'bottom',
};

export const horizontalAlignmentLabels = {
  1: 'left',
  2: 'center',
  3: 'right',
};

export const formatsMap = {
  'calendarFormat': 'MM/dd/yyyy',
  'clockHourFormat': 'hh:mm:ss AM/PM',
  'calendarTimeFormat': 'MM/dd/yyyy h:mm:ss',
  'currencyFormat': '$0.00',
  'currencyRoundedFormat': '$0',
  'financialFormat': '#,##0.00;(#,##0.00)',
  'accountingFormat': '_($* #,##0.00_);_($* (#,##0.00);',
  'numberFormat': '#,##0.00',
  'percentFormat': '0.00%',
  'plainTextFormat': '@',
  'automaticFormat': 'General',
};

export const getFormatTypeFromFormatString = (formatString) => {
  const formatType = Object.keys(formatsMap).find((key) => {
    return formatsMap[key] === formatString;
  });
  return formatType || '';
};