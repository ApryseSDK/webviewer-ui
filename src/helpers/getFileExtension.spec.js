import getFileExtension from './getFileExtension';

describe('getFileExtension', () => {
  it('returns the extension from options if provided', () => {
    expect(getFileExtension(null, { extension: 'pdf' })).toBe('pdf');
  });

  it('returns null if no src or extension in options', () => {
    expect(getFileExtension(null, {})).toBeNull();
    expect(getFileExtension(null)).toBeNull();
  });

  it('extracts extension from File object', () => {
    const file = new File(['dummy content'], 'document.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    expect(getFileExtension(file, {})).toBe('docx');
  });

  it('extracts extension from Blob using filename in options', () => {
    const blob = new Blob(['dummy content'], { type: 'application/pdf' });
    expect(getFileExtension(blob, { filename: 'report.pdf' })).toBe('pdf');
  });

  it('extracts extension from string URL (without query params or fragments)', () => {
    expect(getFileExtension('https://example.com/path/to/file.txt?version=2#section', {})).toBe('txt');
    expect(getFileExtension('https://example.com/path/to/image.jpeg#metadata', {})).toBe('jpeg');
    expect(getFileExtension('https://example.com/path/to/legal-contract.docx', {})).toBe('docx');
  });

  it('returns null for unsupported src types', () => {
    expect(getFileExtension({}, {})).toBeNull();
    expect(getFileExtension([], {})).toBeNull();
    expect(getFileExtension(42, {})).toBeNull();
  });
});
