import getFormatTypeFromFormatString from './getFormatTypeFromFormatString';

describe('getFormatTypeFromFormatString', () => {
  describe('exact matches', () => {
    const exactMatchCases = [
      { testTitle: 'should return "calendarFormat" for MM/dd/yyyy', input: 'MM/dd/yyyy', output: 'calendarFormat' },
      { testTitle: 'should return "clockHourFormat" for hh:mm:ss AM/PM', input: 'hh:mm:ss AM/PM', output: 'clockHourFormat' },
      { testTitle: 'should return "calendarTimeFormat" for MM/dd/yyyy h:mm:ss', input: 'MM/dd/yyyy h:mm:ss', output: 'calendarTimeFormat' },
      { testTitle: 'should return "currencyFormat" for $0.00', input: '$0.00', output: 'currencyFormat' },
      { testTitle: 'should return "currencyRoundedFormat" for $0', input: '$0', output: 'currencyRoundedFormat' },
      { testTitle: 'should return "financialFormat" for #,##0.00;(#,##0.00)', input: '#,##0.00;(#,##0.00)', output: 'financialFormat' },
      { testTitle: 'should return "accountingFormat" for _($* #,##0.00_);_($* (#,##0.00);', input: '_($* #,##0.00_);_($* (#,##0.00);', output: 'accountingFormat' },
      { testTitle: 'should return "numberFormat" for #,##0.00', input: '#,##0.00', output: 'numberFormat' },
      { testTitle: 'should return "percentFormat" for 0.00%', input: '0.00%', output: 'percentFormat' },
      { testTitle: 'should return "plainTextFormat" for @', input: '@', output: 'plainTextFormat' },
      { testTitle: 'should return "automaticFormat" for General', input: 'General', output: 'automaticFormat' },
    ];

    exactMatchCases.forEach(({ testTitle, input, output }) => {
      it(testTitle, () => {
        expect(getFormatTypeFromFormatString(input)).toBe(output);
      });
    });
  });

  describe('currency format variants', () => {
    const currencyVariantCases = [
      { testTitle: 'should return "currencyRoundedFormat" for exactly $0', input: '$0', output: 'currencyRoundedFormat' },
      { testTitle: 'should return "currencyFormat" for $0.0', input: '$0.0', output: 'currencyFormat' },
      { testTitle: 'should return "currencyFormat" for $0.00', input: '$0.00', output: 'currencyFormat' },
      { testTitle: 'should return "currencyFormat" for $0.000', input: '$0.000', output: 'currencyFormat' },
      { testTitle: 'should return "currencyFormat" for $0.0000', input: '$0.0000', output: 'currencyFormat' },
      { testTitle: 'should return "currencyFormat" for $0.123456', input: '$0.123456', output: 'currencyFormat' },
    ];

    currencyVariantCases.forEach(({ testTitle, input, output }) => {
      it(testTitle, () => {
        expect(getFormatTypeFromFormatString(input)).toBe(output);
      });
    });
  });

  describe('number format variants', () => {
    const numberVariantCases = [
      { testTitle: 'should return "numberFormat" for #,##0', input: '#,##0', output: 'numberFormat' },
      { testTitle: 'should return "numberFormat" for #,##0.0', input: '#,##0.0', output: 'numberFormat' },
      { testTitle: 'should return "numberFormat" for #,##0.00', input: '#,##0.00', output: 'numberFormat' },
      { testTitle: 'should return "numberFormat" for #,##0.000', input: '#,##0.000', output: 'numberFormat' },
      { testTitle: 'should return "numberFormat" for #,##0.123456', input: '#,##0.123456', output: 'numberFormat' },
    ];

    numberVariantCases.forEach(({ testTitle, input, output }) => {
      it(testTitle, () => {
        expect(getFormatTypeFromFormatString(input)).toBe(output);
      });
    });
  });

  describe('percent format variants', () => {
    const percentVariantCases = [
      { testTitle: 'should return "percentFormat" for 0%', input: '0%', output: 'percentFormat' },
      { testTitle: 'should return "percentFormat" for 0.0%', input: '0.0%', output: 'percentFormat' },
      { testTitle: 'should return "percentFormat" for 0.00%', input: '0.00%', output: 'percentFormat' },
      { testTitle: 'should return "percentFormat" for 0.000%', input: '0.000%', output: 'percentFormat' },
      { testTitle: 'should return "percentFormat" for 0.123456%', input: '0.123456%', output: 'percentFormat' },
    ];

    percentVariantCases.forEach(({ testTitle, input, output }) => {
      it(testTitle, () => {
        expect(getFormatTypeFromFormatString(input)).toBe(output);
      });
    });
  });

  describe('financial format variants', () => {
    const financialVariantCases = [
      { testTitle: 'should return "financialFormat" for #,##0;(#,##0)', input: '#,##0;(#,##0)', output: 'financialFormat' },
      { testTitle: 'should return "financialFormat" for #,##0.0;(#,##0.0)', input: '#,##0.0;(#,##0.0)', output: 'financialFormat' },
      { testTitle: 'should return "financialFormat" for #,##0.00;(#,##0.00)', input: '#,##0.00;(#,##0.00)', output: 'financialFormat' },
      { testTitle: 'should return "financialFormat" for #,##0.000;(#,##0.000)', input: '#,##0.000;(#,##0.000)', output: 'financialFormat' },
      { testTitle: 'should return "financialFormat" for #,##0.123;(#,##0.123)', input: '#,##0.123;(#,##0.123)', output: 'financialFormat' },
    ];

    financialVariantCases.forEach(({ testTitle, input, output }) => {
      it(testTitle, () => {
        expect(getFormatTypeFromFormatString(input)).toBe(output);
      });
    });
  });

  describe('accounting format variants', () => {
    const accountingVariantCases = [
      { testTitle: 'should return "accountingFormat" for _($* #,##0_);_($* (#,##0);', input: '_($* #,##0_);_($* (#,##0);', output: 'accountingFormat' },
      { testTitle: 'should return "accountingFormat" for _($* #,##0.0_);_($* (#,##0.0);', input: '_($* #,##0.0_);_($* (#,##0.0);', output: 'accountingFormat' },
      { testTitle: 'should return "accountingFormat" for _($* #,##0.00_);_($* (#,##0.00);', input: '_($* #,##0.00_);_($* (#,##0.00);', output: 'accountingFormat' },
      { testTitle: 'should return "accountingFormat" for _($* #,##0.000_);_($* (#,##0.000);', input: '_($* #,##0.000_);_($* (#,##0.000);', output: 'accountingFormat' },
    ];

    accountingVariantCases.forEach(({ testTitle, input, output }) => {
      it(testTitle, () => {
        expect(getFormatTypeFromFormatString(input)).toBe(output);
      });
    });
  });

  describe('edge cases', () => {
    const edgeCases = [
      { testTitle: 'should return empty string for null input', input: null, output: '' },
      { testTitle: 'should return empty string for undefined input', input: undefined, output: '' },
      { testTitle: 'should return empty string for empty string input', input: '', output: '' },
      { testTitle: 'should return empty string for non-matching format', input: 'random-format', output: '' },
      { testTitle: 'should return empty string for partial currency match', input: '$', output: '' },
      { testTitle: 'should return empty string for invalid currency format', input: '$0.', output: '' },
      { testTitle: 'should return empty string for invalid percent format', input: '0.', output: '' },
      { testTitle: 'should return empty string for invalid number format', input: '#,##0.', output: '' },
      { testTitle: 'should return empty string for malformed financial format', input: '#,##0.00;', output: '' },
      { testTitle: 'should return empty string for malformed accounting format', input: '_($* #,##0.00_);', output: '' },
      { testTitle: 'should return empty string for currency format with letters', input: '$0.abc', output: '' },
      { testTitle: 'should return empty string for percent format with letters', input: '0.abc%', output: '' },
      { testTitle: 'should return empty string for number format with letters', input: '#,##0.abc', output: '' },
      { testTitle: 'should return empty string for non-string input', input: 123, output: '' },
      { testTitle: 'should return empty string for boolean input', input: true, output: '' },
      { testTitle: 'should return empty string for object input', input: {}, output: '' },
      { testTitle: 'should return empty string for array input', input: [], output: '' },
    ];

    edgeCases.forEach(({ testTitle, input, output }) => {
      it(testTitle, () => {
        expect(getFormatTypeFromFormatString(input)).toBe(output);
      });
    });
  });

  describe('whitespace handling', () => {
    const whitespaceCases = [
      { testTitle: 'should return empty string for currency format with leading space', input: ' $0.00', output: '' },
      { testTitle: 'should return empty string for currency format with trailing space', input: '$0.00 ', output: '' },
      { testTitle: 'should return empty string for number format with spaces', input: ' #,##0.00 ', output: '' },
      { testTitle: 'should return empty string for percent format with spaces', input: ' 0.00% ', output: '' },
    ];

    whitespaceCases.forEach(({ testTitle, input, output }) => {
      it(testTitle, () => {
        expect(getFormatTypeFromFormatString(input)).toBe(output);
      });
    });
  });
});
