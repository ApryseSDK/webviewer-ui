import loadFont from './loadFont';

describe('loadFont', () => {
  let originalFontFace;
  let originalFonts;
  let fontFaceCount;

  beforeEach(() => {
    originalFontFace = window.FontFace;
    originalFonts = document.fonts;
    fontFaceCount = 0;
    window.FontFace = function FontFace() {
      fontFaceCount++;
      this.load = () => Promise.resolve(this);
    };
    Object.defineProperty(document, 'fonts', { value: { add: jest.fn() }, configurable: true });
  });

  afterEach(() => {
    window.FontFace = originalFontFace;
    Object.defineProperty(document, 'fonts', { value: originalFonts, configurable: true });
  });

  it('should not add a second font face to the document when it is loaded again by another instance', async () => {
    loadFont('Repeat-Font', 'woff');
    loadFont('Repeat-Font', 'woff');
    await Promise.resolve();

    expect(fontFaceCount).toBe(1);
    expect(document.fonts.add).toHaveBeenCalledTimes(1);
  });

  it('should load each distinct style of the same family', async () => {
    loadFont('Styled-Font', 'woff', false, 'Styled-Font-Regular');
    loadFont('Styled-Font', 'woff', false, 'Styled-Font-Bold', { weight: 'bold' });
    await Promise.resolve();

    expect(document.fonts.add).toHaveBeenCalledTimes(2);
  });

  it('should retry a font face whose load failed', async () => {
    window.FontFace = function FontFace() {
      fontFaceCount++;
      this.load = () => Promise.reject(new Error('network'));
    };
    loadFont('Flaky-Font', 'woff');
    await Promise.resolve();
    await Promise.resolve();

    loadFont('Flaky-Font', 'woff');

    expect(fontFaceCount).toBe(2);
  });

  it('should retry a font face that could not be added to the document', async () => {
    document.fonts.add.mockImplementationOnce(() => {
      throw new Error('InvalidModificationError');
    });
    loadFont('Unaddable-Font', 'woff');
    await Promise.resolve();
    await Promise.resolve();

    loadFont('Unaddable-Font', 'woff');
    await Promise.resolve();

    expect(fontFaceCount).toBe(2);
    expect(document.fonts.add).toHaveBeenCalledTimes(2);
  });
});
