export const SpreadsheetEditorEditMode = window.Core.SpreadsheetEditor.SpreadsheetEditorEditMode;

export const CELL_JUSTIFICATION_OPTIONS = {
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

export const CELL_FORMAT_OPTIONS = {
  Currency: 'currency',
  Percent: 'percent',
  IncreaseDecimal: 'increaseDecimal',
  DecreaseDecimal: 'decreaseDecimal',
  More: 'formatMore',
};
export const CELL_ACTION_OPTIONS = {
  Copy: 'copy',
  Paste: 'paste',
  Cut: 'cut',
};

export const CELL_COLOR_OPTIONS = {
  TextColor: 'textColor',
  BackgroundColor: 'backgroundColor',
};

export const checkIfArrayContains = (arr, val, prefix) => {
  return arr.some((item) => {
    const key = val.replace(prefix, '');
    return item === key;
  });
};
