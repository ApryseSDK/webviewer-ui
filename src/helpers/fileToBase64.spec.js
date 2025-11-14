import fileToBase64 from './fileToBase64';

describe('fileToBase64', () => {
  let mockReadAsDataURL;
  let mockOnLoad;
  let mockOnError;

  beforeEach(() => {
    mockReadAsDataURL = jest.fn();
    mockOnLoad = null;
    mockOnError = null;

    global.FileReader = jest.fn(() => ({
      readAsDataURL: mockReadAsDataURL.mockImplementation(function() {
        setTimeout(() => {
          if (mockOnLoad) {
            this.result = 'data:text/plain;base64,aGVsbG8=';
            mockOnLoad({ target: this });
          }
        }, 0);
      }),
      set onload(cb) {
        mockOnLoad = cb;
      },
      set onerror(cb) {
        mockOnError = cb;
      },
    }));
  });

  it('resolves with base64 string when file is read', async () => {
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });

    const result = await fileToBase64(file);

    expect(result).toBe('data:text/plain;base64,aGVsbG8=');
    expect(mockReadAsDataURL).toHaveBeenCalledWith(file);
  });

  it('rejects if FileReader errors', async () => {
    const file = new File(['oops'], 'error.txt', { type: 'text/plain' });

    global.FileReader = jest.fn(() => ({
      readAsDataURL: jest.fn(function() {
        setTimeout(() => {
          if (mockOnError) {
            mockOnError(new Error('Failed to read file'));
          }
        }, 0);
      }),
      set onload(cb) {
        mockOnLoad = cb;
      },
      set onerror(cb) {
        mockOnError = cb;
      },
    }));

    await expect(fileToBase64(file)).rejects.toThrow('Failed to read file');
  });
});