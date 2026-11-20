import { adjustDecimalOnFormatString } from './decimalFormatHelpers';

describe('adjustDecimalOnFormatString', () => {
  it.each([
    ['0', 'increaseDecimalFormat', '0.0'],
    ['0.00', 'decreaseDecimalFormat', '0.0'],
    ['0%', 'decreaseDecimalFormat', '0%'],
    ['#,##0.00;(#,##0.00)', 'increaseDecimalFormat', '#,##0.000;(#,##0.000)'],
    ['_($* #,##0.00_);_($* (#,##0.00);', 'increaseDecimalFormat', '_($* #,##0.000_);_($* (#,##0.000);'],
  ])('adjusts %s with %s', (formatString, action, expected) => {
    expect(adjustDecimalOnFormatString(formatString, action)).toBe(expected);
  });

  it.each(['', 'General', 'MM/dd/yyyy', '"0.00"', '0.00;-0.00;0', '@'])('leaves unsupported format %s unchanged', (formatString) => {
    expect(adjustDecimalOnFormatString(formatString, 'increaseDecimalFormat')).toBe(formatString);
  });
});
