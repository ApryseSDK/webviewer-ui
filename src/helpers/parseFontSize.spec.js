import parseFontSize from './parseFontSize';

describe('parseFontSize', () => {
  it('should parse font size correctly', () => {
    const result = parseFontSize(['30pt', '45pt']);
    expect(result).toEqual([undefined, 'pt']);

    const result2 = parseFontSize('30pt');
    expect(result2).toEqual([30, 'pt']);
  });
});