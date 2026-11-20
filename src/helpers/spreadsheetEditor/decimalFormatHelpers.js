const regexOfValidFormatString = /^([^\d#,.%]{0,10}[#0,]+)(\.0+)?([^\d]{0,10})$/;

const addOneDecimalPlace = (formatString) => formatString.replace(
  /(0)(\.0+)?/,
  (_, integerZero, decimalPart) => decimalPart ? `${integerZero}.${'0'.repeat(decimalPart.length)}` : `${integerZero}.0`,
);

const removeOneDecimalPlace = (formatString) => {
  const match = formatString.match(regexOfValidFormatString);
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

const isAccountingFormat = (formatString) => {
  const accountingRegex = /^_\(\$\* #,##0(\.0+)?_\);_\(\$\* \(#,##0(\.0+)?\);$/;
  return accountingRegex.test(formatString);
};

const isFinancialFormat = (formatString) => {
  const financialRegex = /^#,##0(\.0+)?;\(#,##0(\.0+)?\)$/;
  return financialRegex.test(formatString);
};

const cannotBeAdjustedWithDecimal = (formatString) => {
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
};

const adjustDecimalForSemicolonSeparatedFormat = (formatString, {
  preserveTrailingSemicolon = false,
  adjustDecimalFunction,
}) => {
  const hasTrailingSemicolon = preserveTrailingSemicolon && formatString.endsWith(';');
  const sanitizedFormat = preserveTrailingSemicolon ? formatString.replace(/;$/, '') : formatString;
  const [positive, negative] = sanitizedFormat.split(';');

  const newPositive = adjustDecimalFunction(positive);
  const newNegative = negative ? adjustDecimalFunction(negative) : newPositive;
  return `${newPositive};${newNegative}${hasTrailingSemicolon ? ';' : ''}`;
};

/**
 * @ignore
 * Adjust decimal places in a format string based on the specified type.
 * @param {string} formatString
 * @param {string} type - 'increaseDecimalFormat' or 'decreaseDecimalFormat'
 * @returns {string} - The adjusted format string
 */
export function adjustDecimalOnFormatString(formatString, type) {
  const adjustDecimalFunction = type === 'increaseDecimalFormat' ? addOneDecimalPlace : removeOneDecimalPlace;
  if (cannotBeAdjustedWithDecimal(formatString)) {
    return formatString;
  }

  if (isFinancialFormat(formatString) || isAccountingFormat(formatString)) {
    return adjustDecimalForSemicolonSeparatedFormat(formatString, {
      preserveTrailingSemicolon: isAccountingFormat(formatString),
      adjustDecimalFunction,
    });
  }

  return adjustDecimalFunction(formatString);
}

export default adjustDecimalOnFormatString;
