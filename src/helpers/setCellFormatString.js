import core from 'core';
import { formatsMap } from 'src/constants/spreadsheetEditor';

/**
 * @ignore
 * Example of valid format string: '0.00', '#,##0.00', '0.00%', '0%', '0.00E+00'
 * Example of invalid format string: '0.00;[Red]-0.00', '@', '_', '"0.00"', '($* #,##0_)'
 */
const regexOfValidFormatstring = /^([^\d#,.%]{0,10}[#0,]+)(\.0+)?([^\d]{0,10})$/;

/**
 * @ignore
 * Check if the format string is a valid financial format,
 * valid examples:
 * - '#,##0.00;(#,##0.00)'   ----- 15.00, (-15.00);
 * - '#,##0;(#,##0)'         ----- 15, (-15);
 * - '#,##0.000;(#,##0.000)' ----- 15.000, (-15.000);
 * @param {string} formatString
 * @returns {Boolean}
 */
export const isFinancialFormat = (formatString) => {
  const financialRegex = /^#,##0(\.0+)?;\(#,##0(\.0+)?\)$/;
  return financialRegex.test(formatString);
};

/**
 * @ignore
 * Check if the format string is a valid accounting format,
 * valid examples:
 * - '_($* #,##0_);_($* (#,##0);'          ----- $15, $(15)
 * - '_($* #,##0.00_);_($* (#,##0.00);'    ----- $15.00, $(-15.00);
 * - '_($* #,##0.000_);_($* (#,##0.000);'  ----- $15.000, $(-15.000);
 * @param {string} formatString
 * @returns {Boolean}
 */
export const isAccountingFormat = (formatString) => {
  const accountingRegex = /^_\(\$\* #,##0(\.0+)?_\);_\(\$\* \(#,##0(\.0+)?\);$/;
  return accountingRegex.test(formatString);
};

/**
 * @ignore
 * Check if the format string is invalid to be adjusted with decimal
 * The invalid cases are
 * (1) composite format strings that are not financial or accounting format
 * (2) format strings with special characters like '@' or '_' that are not accounting format
 * (3) format string with double quotes like '"0.00"' is invalid
 * (4) 'General' as format string is invalid
 * (5) date-like format strings like 'MM/dd/yyyy' or 'hh:mm:ss AM/PM' are invalid
 * @param {*} formatString
 * @returns {Boolean}
 */
export function cannotBeAdjustedWithDecimal(formatString) {
  const isQuoted = /".+?"/.test(formatString);
  const isAccounting = isAccountingFormat(formatString);
  const isFinancial = isFinancialFormat(formatString);
  const hasSpecialSymbols = /[_*@]/.test(formatString);
  const hasSemicolon = formatString?.includes(';');
  const isGeneral = formatString.trim().toLowerCase() === 'general';
  const isDateLike = /\b([ymdhs])\1*\b/i.test(formatString);

  return (
    !formatString ||
    isGeneral ||
    isDateLike ||
    isQuoted ||
    (hasSemicolon && !isFinancial && !isAccounting) ||
    (hasSpecialSymbols && !isAccounting)
  );
}

export const adjustDecimalForSemicolonSeparatedFormat = (formatString, options = {
  preserveTrailingSemicolon: false,
  adjustDecimalFunction: undefined,
}) => {
  if (!options.adjustDecimalFunction || !formatString.includes(';')) {
    return formatString;
  }
  const { preserveTrailingSemicolon = false, adjustDecimalFunction } = options;
  const hasTrailingSemicolon = preserveTrailingSemicolon && formatString.endsWith(';');

  const sanitizedFormat = preserveTrailingSemicolon ? formatString.replace(/;$/, '') : formatString;
  const [positive, negative] = sanitizedFormat.split(';');

  const newPositive = adjustDecimalFunction(positive);
  const newNegative = negative ? adjustDecimalFunction(negative) : newPositive;
  let result = `${newPositive};${newNegative}`;

  if (hasTrailingSemicolon) {
    result += ';';
  }

  return result;
};

export const addOneDecimalPlace = (formatString) => {
  return formatString.replace(/(0)(\.0+)?/, (_, intZero, decimalPart) => {
    if (decimalPart) {
      // if there is already a decimal part, add one more 0
      return `${intZero}.${'0'.repeat(decimalPart.length - 1 + 1)}`;
    } else {
      return `${intZero}.0`;
    }
  });
};

/**
 * @ignore
 * Utility function for accounting and financial format to remove one decimal place from a part of the format string.
 * @param {string} formatSubgString
 * @returns {string} - The modified format string with one decimal place removed.
 */
export const removeOneDecimalPlace = (formatString) => {
  const match = formatString.match(regexOfValidFormatstring);
  if (!match || match.length < 2) {
    return formatString;
  }

  const integerPart = match[1];
  let decimalPart = match[2] || '';
  const suffix = match[3] || '';

  if (!decimalPart) {
    return formatString;
  }

  decimalPart = decimalPart.slice(0, -1);
  if (decimalPart === '.') {
    decimalPart = '';
  }

  return `${integerPart}${decimalPart}${suffix}`;
};

export function adjustDecimalOnFormatString(formatString, type) {
  if (cannotBeAdjustedWithDecimal(formatString)) {
    return formatString;
  }

  const adjustDecimalFunction = type === 'increaseDecimalFormat' ? addOneDecimalPlace : removeOneDecimalPlace;

  if (isFinancialFormat(formatString)) {
    return adjustDecimalForSemicolonSeparatedFormat(formatString, {
      adjustDecimalFunction,
    });
  }

  if (isAccountingFormat(formatString)) {
    return adjustDecimalForSemicolonSeparatedFormat(formatString, {
      preserveTrailingSemicolon: true,
      adjustDecimalFunction,
    });
  }

  return adjustDecimalFunction(formatString);
}

export function getDecimalAdjustedFormatString(type) {
  const spreadsheetEditorManager = core.getDocumentViewer().getSpreadsheetEditorManager();
  const cells = spreadsheetEditorManager.getSelectedCells();
  const cell = cells[0];
  const cellStyle = cell.getStyle();
  if (!cellStyle) {
    return;
  }
  const currentFormatString = cellStyle.getDataFormatString();

  let newFormatString;
  // In the case of entering a number initially, the format string will be 'General' and the numericCellValue will be a number
  // we want to set the format string to '#0' in this case before adjusting the decimal
  const shouldSetToNumberFormat = currentFormatString === 'General' && !Number.isNaN(cell.numericCellValue);
  if (shouldSetToNumberFormat) {
    newFormatString = '#0';
  }

  newFormatString = adjustDecimalOnFormatString(newFormatString || currentFormatString, type);

  return newFormatString;
}

function setCellFormatString(formatType) {
  let formatString;
  if (formatType === 'decreaseDecimalFormat' || formatType === 'increaseDecimalFormat') {
    formatString = getDecimalAdjustedFormatString(formatType);
  } else {
    formatString = formatsMap[formatType];
  }

  if (!formatString) {
    return;
  }

  const spreadsheetEditorManager = core.getDocumentViewer().getSpreadsheetEditorManager();
  spreadsheetEditorManager.setSelectedCellsStyle({
    formatString,
  });
}

export default setCellFormatString;