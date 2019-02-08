import documentReducer from 'reducers/documentReducer';
import initialState from 'src/redux/initialState.js';

describe('documentReducer', () => {
  
  test('SET_DOCUMENT_ID', () => {
    const action = { type: 'SET_DOCUMENT_ID', payload: { documentId: 'test' } };
    const expectedState = { ...initialState.document, id: 'test' };
    expect(documentReducer(initialState.document)(undefined, action)).toEqual(expectedState);
  });

  test('SET_DOCUMENT_PATH', () => {
    const action = { type: 'SET_DOCUMENT_PATH', payload: { documentPath: 'test' } };
    const expectedState = { ...initialState.document, path: 'test', file: null, pdfDoc: null };
    expect(documentReducer(initialState.document)(undefined, action)).toEqual(expectedState);
  });

  test('SET_DOCUMENT_FILE', () => {
    const action = { type: 'SET_DOCUMENT_FILE', payload: { documentFile: { name: 'test' } } };
    const expectedState = { ...initialState.document, file: { name: 'test' }, path: 'test', pdfDoc: null};
    expect(documentReducer(initialState.document)(undefined, action)).toEqual(expectedState);
  });

  test('SET_DOCUMENT_TYPE', () => {
    const action = { type: 'SET_DOCUMENT_TYPE', payload: { type: 'test' } };
    const expectedState = { ...initialState.document, type: 'test' };
    expect(documentReducer(initialState.document)(undefined, action)).toEqual(expectedState);
  });

  test('SET_PDF_DOC', () => {
    const action = { type: 'SET_PDF_DOC', payload: { pdfDoc: 'test' } };
    const expectedState = { ...initialState.document, pdfDoc: 'test', file: null };
    expect(documentReducer(initialState.document)(undefined, action)).toEqual(expectedState);
  });

  test('SET_PAGE_NUMBER', () => {
    const action = { type: 'SET_PAGE_NUMBER', payload: { documentPageNumber: 'test' } };
    const expectedState = { ...initialState.document, pageNumber: 'test' };
    expect(documentReducer(initialState.document)(undefined, action)).toEqual(expectedState);
  });

  test('SET_FILENAME', () => {
    const action = { type: 'SET_FILENAME', payload: { filename: 'test' } };
    const expectedState = { ...initialState.document, filename: 'test' };
    expect(documentReducer(initialState.document)(undefined, action)).toEqual(expectedState);
  });

  test('SET_TOTAL_PAGES', () => {
    const action = { type: 'SET_TOTAL_PAGES', payload: { totalPages: 'test' } };
    const expectedState = { ...initialState.document, totalPages: 'test' };
    expect(documentReducer(initialState.document)(undefined, action)).toEqual(expectedState);
  });

  test('SET_OUTLINES', () => {
    const action = { type: 'SET_OUTLINES', payload: { outlines: 'test' } };
    const expectedState = { ...initialState.document, outlines: 'test' };
    expect(documentReducer(initialState.document)(undefined, action)).toEqual(expectedState);
  });

  test('SET_CHECKPASSWORD', () => {
    const action = { type: 'SET_CHECKPASSWORD', payload: { func: 'test' } };
    const expectedState = { ...initialState.document, checkPassword: 'test' };
    expect(documentReducer(initialState.document)(undefined, action)).toEqual(expectedState);
  });

  test('SET_PASSWORD_ATTEMPTS', () => {
    const action = { type: 'SET_PASSWORD_ATTEMPTS', payload: { attempt: 'test' } };
    const expectedState = { ...initialState.document, passwordAttempts: 'test' };
    expect(documentReducer(initialState.document)(undefined, action)).toEqual(expectedState);
  });

  test('SET_PASSWORD', () => {
    const action = { type: 'SET_PASSWORD', payload: { password: 'test' } };
    const expectedState = { ...initialState.document, password: 'test' };
    expect(documentReducer(initialState.document)(undefined, action)).toEqual(expectedState);
  });

  test('SET_PRINT_QUALITY', () => {
    const action = { type: 'SET_PRINT_QUALITY', payload: { quality: 'test' } };
    const expectedState = { ...initialState.document, printQuality: 'test' };
    expect(documentReducer(initialState.document)(undefined, action)).toEqual(expectedState);
  });

  test('SET_LOADING_PROGRESS', () => {
    const action = { type: 'SET_LOADING_PROGRESS', payload: { loadingProgress: 'test' } };
    const expectedState = { ...initialState.document, loadingProgress: 'test' };
    expect(documentReducer(initialState.document)(undefined, action)).toEqual(expectedState);
  });

  test('RESET_LOADING_PROGRESS', () => {
    const action = { type: 'RESET_LOADING_PROGRESS' };
    const expectedState = { ...initialState.document, loadingProgress: 0 };
    expect(documentReducer(initialState.document)(undefined, action)).toEqual(expectedState);
  });
});