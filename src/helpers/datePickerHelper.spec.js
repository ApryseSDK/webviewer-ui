import { DEFAULT_DATE_PICKER_FORMAT, getDatePickerDateFormats } from './datePickerHelper';

describe('datePickerHelper', () => {
  it('always includes the default date picker format when no formats are configured', () => {
    expect(getDatePickerDateFormats()).toEqual([DEFAULT_DATE_PICKER_FORMAT]);
  });

  it('converts configured dayjs date formats into PDF date picker formats', () => {
    const formats = getDatePickerDateFormats([
      { date: 'MMMM D, YYYY' },
      { date: 'ddd, MMM Do, YY' },
    ]);

    expect(formats).toEqual([
      DEFAULT_DATE_PICKER_FORMAT,
      'mmmm d, yyyy',
      'ddd, mmm Do, yy',
    ]);
  });

  it('trims converted values and filters out empty or duplicate formats', () => {
    const formats = getDatePickerDateFormats([
      { date: ' M/D/YY ' },
      { date: '' },
      {},
      { date: 'M/D/YY' },
    ]);

    expect(formats).toEqual([DEFAULT_DATE_PICKER_FORMAT]);
  });
});