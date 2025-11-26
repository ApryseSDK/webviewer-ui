import DataElements from './dataElement';

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

export const wrapTextLabels = {
  1: 'overflow',
  2: 'wrap',
  3: 'clip',
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

export const SPREADSHEET_EDITOR_SCOPE = 'spreadsheet-editor';

export const ELEMENTS_TO_DISABLE_IN_SPREADSHEET_EDITOR = [
  DataElements.CONTEXT_MENU_POPUP
];

export const ELEMENTS_TO_ENABLE_IN_SPREADSHEET_EDITOR = [
  DataElements.SEARCH_PANEL_REPLACE_CONTAINER
];

export const getFormatTypeFromFormatString = (formatString) => {
  const formatType = Object.keys(formatsMap).find((key) => {
    return formatsMap[key] === formatString;
  });

  if (formatType) {
    return formatType;
  }

  const numberFormatPatterns = [
    { key: 'currencyRoundedFormat', pattern: /^\$0$/ }, // Matches exactly $0 (no decimals)
    { key: 'currencyFormat', pattern: /^\$0\.\d+$/ }, // Matches $0.0, $0.00, $0.000, etc. (with decimals)
    { key: 'financialFormat', pattern: /^#,##0(\.\d+)?;(\(#,##0(\.\d+)?\))?$/ },
    { key: 'accountingFormat', pattern: /^_\(\$\* #,##0(\.\d+)?_\);_\(\$\* \(#,##0(\.\d+)?\);$/ },
    { key: 'numberFormat', pattern: /^#,##0(\.\d+)?$/ },
    { key: 'percentFormat', pattern: /^0(\.\d+)?%$/ }
  ];

  const match = numberFormatPatterns.find((pattern) => pattern.pattern.test(formatString));
  return match ? match.key : '';
};

export const SPREADSHEET_EDITOR_IMAGE_FORMATS = ['jpg', 'jpeg', 'png', 'bmp', 'webp', 'gif'].map(
  (format) => `.${format}`,
).join(', ');