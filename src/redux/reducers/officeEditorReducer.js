export default (initialState) => (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'SET_OFFICE_EDITOR_CURSOR_PROPERTIES': {
      const { cursorProperties } = payload;

      return {
        ...state,
        cursorProperties,
      };
    }
    case 'SET_OFFICE_EDITOR_SELECTION_PROPERTIES': {
      const { selectionProperties } = payload;
      return {
        ...state,
        selectionProperties,
      };
    }
    case 'SET_OFFICE_EDITOR_PARAGRAPH_PROPERTIES': {
      const { paragraphProperties } = payload;
      return {
        ...state,
        paragraphProperties,
      };
    }
    case 'ADD_OFFICE_EDITOR_AVAILABLE_FONT_FACE': {
      const { fontFace } = payload;
      const fontFaces = state.availableFontFaces.slice();
      fontFaces.push(fontFace);
      return {
        ...state,
        availableFontFaces: fontFaces.sort(),
      };
    }
    default:
      return state;
  }
};
