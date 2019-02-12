import getNumberOfPagesToNavigate from 'helpers/getNumberOfPagesToNavigate';

describe('getNumberOfPagesToNavigate', () => {

  test('Single', () => {
    expect(getNumberOfPagesToNavigate('Single')).toBe(1);
  });

  test('Facing', () => {
    expect(getNumberOfPagesToNavigate('Facing')).toBe(2);
  });

  test('CoverFacing', () => {
    expect(getNumberOfPagesToNavigate('CoverFacing')).toBe(2);
  });
});