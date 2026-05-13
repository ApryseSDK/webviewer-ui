import { createLoadErrorMessage, createStructuredLoadError } from 'helpers/loadError';

describe('loadError', () => {
  it('should format the load error message exactly like Core output', () => {
    const createdMessage = createLoadErrorMessage({
      message: 'Doc root not found',
      filename: 'PasswordModal',
      functionName: 'renderContent',
      lineNumber: '42',
    });

    expect(createdMessage).toBe('Exception:\n\t Message: Doc root not found\n\t Filename: PasswordModal\n\t Function: renderContent\n\t Linenumber: 42');
  });

  it('should omit optional fields when they are omitted', () => {
    const createdMessage = createLoadErrorMessage({
      message: 'Doc root not found',
    });

    expect(createdMessage).toBe('Exception:\n\t Message: Doc root not found');
  });

  it('should omit optional fields when they are empty strings or undefined', () => {
    const createdMessage = createLoadErrorMessage({
      message: 'Doc root not found',
      filename: '',
      functionName: undefined,
      lineNumber: '',
    });

    expect(createdMessage).toBe('Exception:\n\t Message: Doc root not found');
  });

  it('should return a structured load error object with type and formatted message', () => {
    const createdStructuredError = createStructuredLoadError({
      message: 'Doc root not found',
      type: 'InvalidPDF',
      filename: 'file.cpp',
      functionName: 'FnName',
    });

    expect(createdStructuredError).toEqual({
      message: 'Exception:\n\t Message: Doc root not found\n\t Filename: file.cpp\n\t Function: FnName',
      type: 'InvalidPDF',
    });
  });
});