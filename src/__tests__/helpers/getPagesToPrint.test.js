import getPagesToPrint from 'helpers/getPagesToPrint';
import core from 'core';

describe('getPagesToPrint', () => {

  core.getTotalPages = jest.fn().mockReturnValueOnce(3);

  test('no customer input', () => {
    expect(getPagesToPrint()).toEqual([ 1, 2, 3 ]);
  });

  test('single page default', () => {
    core.getTotalPages = jest.fn().mockReturnValue(15);
    expect(getPagesToPrint('1', ['1'])).toEqual([ 1 ]);
  });

  test('multiple pages default', () => {
    expect(getPagesToPrint('1,3,5', ['1','3','5'])).toEqual([ 1, 2, 3 ]);
  });

  test('multiple pages with custom labels', () => {
    expect(getPagesToPrint('i,ii,iii', ['i','ii','iii'])).toEqual([ 1, 2, 3 ]);
  });

  test('multipled scattered pages', () => {
    expect(getPagesToPrint('1,2,4,5', ['1','2','3','4','5'])).toEqual([ 1, 2, 4, 5 ]);
  });

  test('multiple pages with custom labels', () => {
    expect(getPagesToPrint('i,iii,v', ['i', 'ii', 'iii', 'iv', 'v'])).toEqual([ 1, 3, 5 ]);
  });

  test('mutiple pages with range', () => {
    expect(getPagesToPrint('1-5,6-7', ['1','2','3','4','5','6','7'])).toEqual([ 1, 2, 3, 4, 5, 6, 7 ]);
  });

  test('multiple pages with range and custom labels', () => {
    expect(getPagesToPrint('un-quatre,sept-neuf,cinq', ['un','deux','trois','quatre','cinq','six','sept','huit','neuf'])).toEqual([ 1, 2, 3, 4, 5, 7, 8, 9 ]);
  });
});