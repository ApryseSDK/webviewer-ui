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
    default:
      return state;
  }
};
