export default (initialState) => (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'SET_WV3D_PROPERTIES_PANEL_MODEL_DATA': {
      const { modelData } = payload;

      return {
        ...state,
        modelData,
      };
    }

    case 'SET_WV3D_PROPERTIES_PANEL_SCHEMA': {
      const { schema } = payload;

      return {
        ...state,
        schema,
      };
    }

    default:
      return state;
  }
};
