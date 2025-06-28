const colorSetters = {
  'SET_CELL_BACKGROUND_COLORS': 'cellBackgroundColors',
  'SET_TEXT_COLORS': 'textColors',
  'SET_BORDER_COLORS': 'borderColors',
};

export default (initialState) => (state = initialState, action) => {
  const { type, payload } = action;

  if (type in colorSetters) {
    return {
      ...state,
      [colorSetters[type]]: [...payload.colors],
    };
  }

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
    case 'SET_SELECTED_BORDER_COLOR_OPTION': {
      const { selectedBorderColorOption } = payload;
      return {
        ...state,
        selectedBorderColorOption,
      };
    }
    case 'SET_SELECTED_BORDER_STYLE_OPTION': {
      const { selectedBorderStyleListOption } = payload;
      return {
        ...state,
        selectedBorderStyleListOption,
      };
    }
    default:
      return state;
  }
};
