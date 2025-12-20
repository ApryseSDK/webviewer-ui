import { isOpenableFile } from './portfolio';

describe('isOpenableFile', function() {
  beforeEach(() => {
    window.Core = {
      SupportedFileFormats: {
        CLIENT: ['pdf', 'docx', 'jpg', 'jpeg', 'png', 'txt', 'xls', 'xlsx']
      }
    };
  });

  it('should return true for uppercase JPG extension', () => {
    expect(isOpenableFile('JPG')).toEqual(true);
  });

  it('should return true for supported extensions regardless of case', () => {
    expect(isOpenableFile('pdf')).toEqual(true);
    expect(isOpenableFile('PDF')).toEqual(true);
    expect(isOpenableFile('PdF')).toEqual(true);
  });

  it('should return false for unsupported extensions', () => {
    expect(isOpenableFile('exe')).toEqual(false);
    expect(isOpenableFile('XYZ')).toEqual(false);
  });

  it('should return false for empty string', () => {
    expect(isOpenableFile('')).toEqual(false);
  });

  it('should handle all supported file formats with case variations', () => {
    const supportedFormats = ['pdf', 'docx', 'jpg', 'jpeg', 'png', 'txt', 'xls', 'xlsx'];
    supportedFormats.forEach((format) => {
      expect(isOpenableFile(format)).toEqual(true);
      expect(isOpenableFile(format.toUpperCase())).toEqual(true);
    });
  });
});
