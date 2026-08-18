import { extractUniqueFontFamilies } from './stylePanelHelper';

jest.mock('core');

beforeAll(() => {
  window.Core = window.Core || {};
  window.Core.Tools = window.Core.Tools || {};
  window.Core.Annotations = window.Core.Annotations || {};
});

describe('extractUniqueFontFamilies', () => {
  it('returns empty fonts and sizes for empty jsonData', () => {
    expect(extractUniqueFontFamilies({}, 'hello')).toEqual({ fonts: [], sizes: [] });
  });

  it('ignores breakpoints at or beyond the end of inputText (e.g. Quill\'s synthetic trailing newline)', () => {
    const inputText = 'Hi';
    const jsonData = {
      0: { 'font-family': 'Arial', 'font-size': '12pt' },
      // index 2 is out of bounds for a 2-character string and should be ignored
      2: { 'font-family': 'Times New Roman', 'font-size': '20pt' },
    };

    expect(extractUniqueFontFamilies(jsonData, inputText)).toEqual({
      fonts: ['Arial'],
      sizes: ['12pt'],
    });
  });

  it('collects multiple distinct fonts and sizes that are within bounds', () => {
    const inputText = 'AB';
    const jsonData = {
      0: { 'font-family': 'Arial', 'font-size': '12pt' },
      1: { 'font-family': 'Courier', 'font-size': '14pt' },
    };

    const result = extractUniqueFontFamilies(jsonData, inputText);
    expect(result.fonts.sort()).toEqual(['Arial', 'Courier']);
    expect(result.sizes.sort()).toEqual(['12pt', '14pt']);
  });

  it('skips indices that land on a space character', () => {
    const inputText = 'A B';
    const jsonData = {
      1: { 'font-family': 'Arial', 'font-size': '12pt' },
    };

    expect(extractUniqueFontFamilies(jsonData, inputText)).toEqual({ fonts: [], sizes: [] });
  });
});
