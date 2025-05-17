export default (initialState) => (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'SET_ACTIVE_CELL_RANGE': {
      const { activeCellRange, cellProperties } = payload;
      return {
        ...state,
        activeCellRange,
        cellProperties: {
          ...cellProperties
        }
      };
    }
    case 'SET_SPREADSHEET_EDITOR_EDIT_MODE':
      return {
        ...state,
        editMode: payload.mode,
      };
    case 'SET_ACTIVE_CELL_RANGE_STYLE': {
      const { styles } = payload;
      return {
        ...state,
        cellProperties: {
          ...state.cellProperties,
          styles: {
            ...state.cellProperties.styles,
            ...styles,
            font: {
              ...state.cellProperties.styles.font,
              ...(styles.font || {}),
            },
          },
        },
      };
    }
    case 'SET_CELL_STYLE_COLORS': {
      const { cellStyleColors } = payload;
      return {
        ...state,
        cellStyleColors: [
          ...cellStyleColors,
        ],
      };
    }
    default:
      return state;
  }
};
