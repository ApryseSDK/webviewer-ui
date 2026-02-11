import getFilename from 'helpers/getFilename';

describe('getFilename', () => {
  it('returns the filename from options if provided', () => {
    expect(getFilename(null, { filename: 'test.pdf' })).toBe('test.pdf');
  });

  it('returns null if no src or name in options', () => {
    expect(getFilename(null, {})).toBeNull();
    expect(getFilename(null)).toBeNull();
  });

  it('extracts name from File object', () => {
    const file = new File(['dummy content'], 'document.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    expect(getFilename(file, {})).toBe('document.docx');
  });

  it('extracts name from string URL', () => {
    expect(getFilename('https://example.com/path/to/legal-contract.docx', {})).toBe('legal-contract.docx');
  });

  it('returns null for unsupported src types', () => {
    expect(getFilename({}, {})).toBeNull();
    expect(getFilename([], {})).toBeNull();
    expect(getFilename(42, {})).toBeNull();
  });
});
