export default (initialState) => (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'SET_DOCUMENT_FILE':
      return { ...state, file: payload.documentFile, path: payload.documentFile.name, pdfDoc: null };
    case 'SET_PAGE_NUMBER':
      return { ...state, pageNumber: payload.documentPageNumber };
    case 'SET_TOTAL_PAGES':
      return {
        ...state,
        totalPages: {
          ...state.totalPages,
          [payload.documentViewerKey]: payload.totalPages,
        }
      };
    case 'SET_OUTLINES':
      return { ...state, outlines: payload.outlines };
    case 'SET_BOOKMARKS':
    {
      return { ...state, bookmarks: payload.bookmarks };
    }
    case 'ADD_BOOKMARK':
    case 'EDIT_BOOKMARK':
    {
      const newBookmarks = { ...state.bookmarks };
      newBookmarks[payload.pageIndex] = payload.text;
      return { ...state, bookmarks: newBookmarks };
    }
    case 'REMOVE_BOOKMARK':
    {
      const newBookmarks = { ...state.bookmarks };
      delete newBookmarks[payload.pageIndex];

      return { ...state, bookmarks: newBookmarks };
    }
    case 'SET_LAYERS':
      return { ...state, layers: payload.layers };
    case 'SET_PASSWORD_ATTEMPTS':
      return { ...state, passwordAttempts: payload.attempt };
    case 'SET_PRINT_QUALITY':
      return { ...state, printQuality: payload.quality };
    case 'SET_DEFAULT_PRINT_OPTIONS':
      return { ...state, defaultPrintOptions: payload.options };
    case 'SET_LOADING_PROGRESS':
      return { ...state, loadingProgress: payload.progress };
    default:
      return state;
  }
};
