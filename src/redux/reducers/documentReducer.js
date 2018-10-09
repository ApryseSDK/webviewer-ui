export default initialState => (state = initialState, action) => {
  const { type, payload } = action;

  switch(type) {
    case 'SET_DOCUMENT_ID':
      return { ...state, id: payload.documentId };
    case 'SET_DOCUMENT_PATH':
      return { ...state, path: payload.documentPath, file: null, pdfDoc: null };
    case 'SET_DOCUMENT_FILE':
      return { ...state, file: payload.documentFile, path: payload.documentFile.name, pdfDoc: null };
    case 'SET_DOCUMENT_TYPE':
      return { ...state, type: payload.type };
    case 'SET_PDF_DOC':
      return { ...state, pdfDoc: payload.pdfDoc, file: null };
    case 'SET_PAGE_NUMBER':
      return { ...state, pageNumber: payload.documentPageNumber };
    case 'SET_FILENAME':
      return { ...state, filename: payload.filename };
    case 'SET_TOTAL_PAGES':
      return { ...state, totalPages: payload.totalPages };
    case 'SET_OUTLINES':
      return { ...state, outlines: payload.outlines };
    case 'SET_CHECKPASSWORD':
      return { ...state, checkPassword: payload.func };
    case 'SET_PRINT_QUALITY':
      return { ...state, printQuality: payload.quality };
    default:
      return state;
  }
};